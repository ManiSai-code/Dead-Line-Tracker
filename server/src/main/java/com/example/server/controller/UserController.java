package com.example.server.controller;

import com.example.server.model.User; // Make sure this import exists!
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. ADD THIS METHOD: This handles the GET request (fixes the 404)
    @GetMapping("/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) { // Change ? to User
    return userRepository.findById(id)
            .map(user -> ResponseEntity.ok(user)) // Here, 'user' is an instance of User
            .orElse(ResponseEntity.notFound().build());
}

    // 2. KEEP THIS METHOD: This handles the toggle update
    @PutMapping("/{id}/notifications/whatsapp")
    public ResponseEntity<?> updateWhatsAppPreference(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        return userRepository.findById(id).map(user -> {
            user.setWhatsappEnabled(payload.get("enabled"));
            userRepository.save(user);
            return ResponseEntity.ok("Preference updated");
        }).orElse(ResponseEntity.notFound().build());
    }
}