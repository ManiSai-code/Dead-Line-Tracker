package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
public class ApiController {

    // This connects the Repository to the Controller
    @Autowired
    private DeadlineRepository deadlineRepository;

    @GetMapping("/api/status")
    public String getStatus() {
        return "Backend is running!";
    }

    // New: Get all deadlines from the database
    @GetMapping("/api/deadlines")
    public List<Deadline> getAllDeadlines() {
        return deadlineRepository.findAll();
    }

    // New: Save a new deadline coming from React
    @PostMapping("/api/deadlines")
    public Deadline addDeadline(@RequestBody Deadline deadline) {
        return deadlineRepository.save(deadline);
    }
}