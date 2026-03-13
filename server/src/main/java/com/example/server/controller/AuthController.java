package com.example.server.controller;

import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

// ONE annotation to rule them all: handles the "Preflight" OPTIONS request and the PUT method.
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // --- SIGNUP ---
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username taken!");
        }
        // HASH THE PASSWORD before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        Optional<User> dbUser = userRepository.findByUsername(user.getUsername());
        
        // Use .matches() to compare plain text with the hash in DB
        if (dbUser.isPresent() && passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {
            return ResponseEntity.ok(dbUser.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // --- UPDATE PROFILE (General Settings) ---
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            user.setPhoneNumber(userDetails.getPhoneNumber());
            user.setGender(userDetails.getGender());
            
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- UPDATE THEME (Specific for Dark Mode) ---
    @PutMapping("/update-theme/{userId}")
    public ResponseEntity<?> updateTheme(@PathVariable Long userId, @RequestBody boolean isDark) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setDarkMode(isDark);
                userRepository.save(user);
                // Return a JSON-formatted string to prevent React parse errors
                return ResponseEntity.ok().body("{\"message\": \"Theme updated to " + (isDark ? "Dark" : "Light") + "\"}");
            }).orElse(ResponseEntity.notFound().build());
    }
}