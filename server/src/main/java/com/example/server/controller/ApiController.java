package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.server.model.Deadline;
import com.example.server.repository.DeadlineRepository;
import com.example.server.repository.UserRepository;
import com.example.server.model.User;
import java.util.List;

@RestController
@RequestMapping("/api/deadlines") // This sets the base URL for all methods here
@CrossOrigin(origins = "http://localhost:5173") // Better to be specific than "*"
public class ApiController {

    @Autowired
    private DeadlineRepository deadlineRepository;
    
    @Autowired
    private UserRepository userRepository;

    // This will now be: GET http://localhost:8080/api/deadlines?userId=...
    @GetMapping
    public List<Deadline> getDeadlines(@RequestParam Long userId) {
        return deadlineRepository.findByUserId(userId);
    } // <--- This bracket was missing!

    // This will now be: POST http://localhost:8080/api/deadlines?userId=...
    @PostMapping
    public Deadline addDeadline(@RequestBody Deadline deadline, @RequestParam Long userId) {
        return userRepository.findById(userId).map(user -> {
            deadline.setUser(user);
            return deadlineRepository.save(deadline);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // This will now be: DELETE http://localhost:8080/api/deadlines/5
    @DeleteMapping("/{id}")
    public void deleteDeadline(@PathVariable Long id) {
        deadlineRepository.deleteById(id);
    }
}