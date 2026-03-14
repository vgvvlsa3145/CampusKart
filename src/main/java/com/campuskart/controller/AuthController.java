package com.campuskart.controller;

import com.campuskart.model.User;
import com.campuskart.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(credentials.get("username"), credentials.get("password"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            
            // Explicitly create session
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            String username = auth.getName();
            User user = userRepository.findByUsername(username).get();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("username", user.getUsername());
            response.put("role", user.getRole().name());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userDetails) {
        String username = userDetails.get("username");
        String password = userDetails.get("password");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            Optional<User> userOpt = userRepository.findByUsername(auth.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("role", user.getRole().name());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out");
    }
}
