package com.example.server.controller;

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

    // 1. SIGN UP ENDPOINT
    @PostMapping("/signup")
public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        return ResponseEntity.badRequest().body("Username is already taken!");
    }
    // Save the user and capture the saved version (which includes the ID)
    User savedUser = userRepository.save(user); 
    
    // Return the savedUser object as JSON
    return ResponseEntity.ok(savedUser); 
}

    // 2. LOGIN ENDPOINT
    @PostMapping("/login")
public ResponseEntity<?> authenticateUser(@RequestBody User user) {
    Optional<User> dbUser = userRepository.findByUsername(user.getUsername());

    if (dbUser.isPresent() && dbUser.get().getPassword().equals(user.getPassword())) {
        // SUCCESS: Return the whole user object (includes the ID)
        return ResponseEntity.ok(dbUser.get()); 
    }
    
    // FAILURE: Return a plain text error
    return ResponseEntity.status(401).body("Invalid username or password");
}
}