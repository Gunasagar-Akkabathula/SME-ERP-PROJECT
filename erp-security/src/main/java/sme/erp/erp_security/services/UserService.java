package sme.erp.erp_security.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sme.erp.erp_security.controller.dto.RegisterRequest;
import sme.erp.erp_security.model.Role;
import sme.erp.erp_security.model.User;
import sme.erp.erp_security.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------- REGISTRATION ----------
    public void registerUser(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);

        long count = userRepository.count();

        // First ever user becomes ADMIN (bootstrap)
        if (count == 0) {
            user.setRole(Role.ADMIN);
        } else {
            // After first user: set requested role, default USER
            Role requestedRole = request.getRole();

            if (requestedRole == null) {
                user.setRole(Role.USER);
            } else if (requestedRole == Role.ADMIN) {
                // Security: do not allow ADMIN via public registration
                throw new IllegalArgumentException("ADMIN role cannot be self-assigned");
            } else {
                // USER / HR / INVENTORY / SALES / ACCOUNTANT
                user.setRole(requestedRole);
            }
        }

        userRepository.save(user);
    }

    // ---------- ROLES FOR /auth/me ----------
    /**
     * Returns a normalized list of roles without "ROLE_" prefix.
     * Example: ["ADMIN"] or ["USER"]
     */
    public List<String> getRolesByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        Role role = user.getRole();
        if (role == null) {
            return List.of();
        }

        return List.of(role.name());
    }
}
