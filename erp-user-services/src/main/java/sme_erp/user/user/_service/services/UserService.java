package sme_erp.user.user._service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sme_erp.user.user._service.model.User;
import sme_erp.user.user._service.repository.UserRepository;
import sme_erp.user.user._service.dto.UserCreateRequest;
import sme_erp.user.user._service.dto.UserUpdateRequest;
import sme_erp.user.user._service.dto.UserResponse;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // If you already have a PasswordEncoder bean in erp-security and expose it, wire it here.
    // For now, keep it optional; if not configured, passwords will be stored as plain text (not recommended).
    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    // -------- Existing method (kept) --------
    public User findByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    // -------- CREATE --------
    public UserResponse createUser(UserCreateRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use: " + request.getEmail());
        }

        String encodedPassword = request.getPassword();
        if (passwordEncoder != null) {
            encodedPassword = passwordEncoder.encode(request.getPassword());
        }

        Set<String> roles = request.getRoles();
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                encodedPassword,
                roles
        );

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    // -------- READ: by id --------
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toResponse(user);
    }

    // -------- READ: all --------
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // -------- UPDATE --------
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            user.setRoles(request.getRoles());
        }

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    // -------- SOFT DELETE --------
    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setEnabled(false);
        userRepository.save(user);
    }

    // -------- Helper: map Entity -> DTO --------
    private UserResponse toResponse(User user) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setUsername(user.getUsername());
        resp.setEmail(user.getEmail());
        resp.setRoles(user.getRoles());
        resp.setEnabled(user.isEnabled());
        resp.setCreatedAt(user.getCreatedAt());
        resp.setUpdatedAt(user.getUpdatedAt());
        return resp;
    }
}
