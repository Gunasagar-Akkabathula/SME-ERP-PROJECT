package sme_erp.user.user._service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sme_erp.user.user._service.model.User;
import sme_erp.user.user._service.services.UserService;
import sme_erp.user.user._service.dto.UserCreateRequest;
import sme_erp.user.user._service.dto.UserUpdateRequest;
import sme_erp.user.user._service.dto.UserResponse;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // Simple root endpoint: "/user"
    @GetMapping("/user")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("User service is working!");
    }

    // Current logged-in user via headers from gateway
    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "X-User-Name", required = false) String username,
            @RequestHeader(value = "X-User-Roles", required = false) String rolesHeader) {

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(401).body("Missing user context");
        }

        try {
            User user = userService.findByUsername(username);
            String rolesString = String.join(", ", user.getRoles());
            return ResponseEntity.ok(new UserProfileResponse(user.getUsername(), rolesString));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("User not found: " + username);
        }
    }

    public record UserProfileResponse(String username, String roles) {}

    // -------- CRUD endpoints --------

    // CREATE user
    @PostMapping("/user")
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.ok(created);
    }

    // READ: get one user by id
    @GetMapping("/user/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // READ: get all users
    @GetMapping("/user/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // UPDATE user
    @PutMapping("/user/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request) {
        UserResponse updated = userService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }

    // SOFT DELETE user (enabled = false)
    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
