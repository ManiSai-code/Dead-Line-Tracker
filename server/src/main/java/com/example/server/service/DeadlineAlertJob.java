package com.example.server.service; // Adjust if your package structure differs
import com.example.server.model.User;
import com.example.server.model.Deadline;
import com.example.server.repository.DeadlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DeadlineAlertJob {

    @Autowired
    private DeadlineRepository deadlineRepository;

    @Autowired
    private EmailService emailService;

    // Add this to interact directly with the Database context
    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @Scheduled(cron = "0 0 12 * * *",zone = "Asia/Kolkata")
    @org.springframework.transaction.annotation.Transactional
    public void checkAndSendUpcomingDeadlines() {
        // 1. CLEAR THE CACHE
        // This forces Spring to talk to the DB directly instead of using its memory
        entityManager.clear(); 

        System.out.println("Starting daily deadline check (Fresh Cache)...");

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        String targetDate = tomorrow.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        // 2. FETCH DATA
        List<Deadline> upcomingTasks = deadlineRepository
                .findByDueDateAndCompletedFalseAndUser_EmailNotificationsEnabledTrue(targetDate);

        for (Deadline task : upcomingTasks) {
            User user = task.getUser();
            
            // 3. FINAL DOUBLE-CHECK
            if (user != null && user.isEmailNotificationsEnabled()) {
                emailService.sendDeadlineAlert(
                        user.getEmail(), 
                        task.getTask(), 
                        task.getDueDate(), 
                        task.getPriority()
                );
            } else {
                // If the bug was happening, you will see this print now!
                System.out.println("DEBUG: Blocked an email to " + (user != null ? user.getUsername() : "Unknown") + " because settings are OFF.");
            }
        }
        System.out.println("Finished check. Tasks processed: " + upcomingTasks.size());
    }
}