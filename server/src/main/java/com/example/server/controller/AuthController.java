package com.example.server.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow your React app access
public class AuthController {

    @Autowired
    private UserRepository userRepository;

   @Autowired
private BCryptPasswordEncoder passwordEncoder;

@PostMapping("/signup")
public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username taken!");
    }
    // HASH THE PASSWORD before saving
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return ResponseEntity.ok(userRepository.save(user));
}

@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody User user) {
    Optional<User> dbUser = userRepository.findByUsername(user.getUsername());
    
    // Use .matches() to compare plain text with the hash
    if (dbUser.isPresent() && passwordEncoder.matches(user.getPassword(), dbUser.get().getPassword())) {
        return ResponseEntity.ok(dbUser.get());
    }
    return ResponseEntity.status(401).body("Invalid credentials");
}}