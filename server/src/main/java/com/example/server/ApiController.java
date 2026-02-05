package com.example.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*; // This covers DeleteMapping and PathVariable
import java.util.List;
import java.time.LocalDate;
@RestController
@CrossOrigin(origins = "*") 
public class ApiController {

    @Autowired
    private DeadlineRepository deadlineRepository;

    @GetMapping("/api/status")
    public String getStatus() {
        return "Backend is running!";
    }

    @GetMapping("/api/deadlines")
    public List<Deadline> getAllDeadlines() {
        return deadlineRepository.findAll();
    }

    @PostMapping("/api/deadlines")
public Deadline addDeadline(@RequestBody Deadline deadline) {
    LocalDate taskDate = LocalDate.parse(deadline.getDueDate());
    if (taskDate.isBefore(LocalDate.now())) {
        throw new RuntimeException("Cannot set deadlines in the past!");
    }
    return deadlineRepository.save(deadline);
}

    // This is now correctly inside the class and uses deadlineRepository
    @DeleteMapping("/api/deadlines/{id}")
    public void deleteDeadline(@PathVariable Long id) {
        deadlineRepository.deleteById(id);
    }
}