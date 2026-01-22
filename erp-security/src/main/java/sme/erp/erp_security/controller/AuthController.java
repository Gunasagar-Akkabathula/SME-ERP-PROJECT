package sme.erp.erp_security.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import sme.erp.erp_security.controller.dto.LoginRequest;
import sme.erp.erp_security.controller.dto.RegisterRequest;
import sme.erp.erp_security.security.JwtService;
import sme.erp.erp_security.services.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // ---------- REGISTER ----------
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ---------- LOGIN (ISSUE JWT) ----------
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(Map.of("token", token));
    }

    // ---------- CURRENT USER (FROM TOKEN) ----------
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing token"));
        }

        String token = authHeader.substring(7);

        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        // Prefer reading roles from JWT claim (stateless), fallback to DB during transition. [web:372]
        List<String> roles;
        try {
            roles = jwtService.extractClaim(token, claims -> {
                Object raw = claims.get("roles");
                if (raw instanceof List<?> list) {
                    return list.stream().map(String::valueOf).collect(Collectors.toList());
                }
                return Collections.<String>emptyList();
            });
        } catch (Exception ex) {
            roles = List.of();
        }

        if (roles == null || roles.isEmpty()) {
            // fallback (older tokens might not have "roles" claim)
            roles = userService.getRolesByUsername(username);
        }

        List<Map<String, String>> authorities = roles.stream()
                .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                .distinct()
                .map(r -> Map.of("authority", r))
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "username", username,
                "authorities", authorities
        ));
    }

    // simple health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("security services is ", "UP"));
    }
}
