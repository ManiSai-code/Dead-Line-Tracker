package com.example.server.scheduler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.example.server.repository.DeadlineRepository;
import com.example.server.repository.DeadlineRepository;
import com.example.server.service.EmailService; // <--- This one!
import com.example.server.model.Deadline;
@Component
public class SmartEmailScheduler {

    @Autowired
    private DeadlineRepository repository;
    @Autowired
    private EmailService emailService;

    // Run every hour to check for candidates
     
 // 60000ms = 1 minute for testing
@Scheduled(fixedRate = 30000)
public void processSmartAlerts() {
    List<Deadline> deadlines = repository.findAllActive();
    LocalDateTime now = LocalDateTime.now();

    for (Deadline task : deadlines) {
    try {
        String rawDate = task.getDueDate(); 
        LocalDateTime deadlineDate;

        if (rawDate == null) continue;

        if (rawDate.length() == 10) {
            deadlineDate = LocalDate.parse(rawDate).atTime(9, 0); 
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            deadlineDate = LocalDateTime.parse(rawDate, formatter);
        }

        long hoursRemaining = ChronoUnit.HOURS.between(now, deadlineDate);
        LocalDateTime lastSent = task.getLastAlertSentAt();

        // Check if we should send
        if (shouldSendAlert(hoursRemaining, lastSent, now)) {
            emailService.sendDeadlineAlert(
                task.getUser().getEmail(), 
                task.getTask(), 
                task.getDueDate(), 
                task.getPriority()
            );

            task.setLastAlertSentAt(now);
            repository.save(task);
            System.out.println("✅ EMAIL SENT for: " + task.getTask());
        } 
        else {
            // --- ADD THIS ELSE BLOCK ---
            long minsSince = (lastSent != null) ? java.time.Duration.between(lastSent, now).toMinutes() : 0;
            System.out.println("❌ SKIP: Not time yet for [" + task.getTask() + 
                               "] | Hours left: " + hoursRemaining + 
                               " | Last sent: " + minsSince + " mins ago");
        }

    } catch (Exception e) {
        System.err.println("Skipping task '" + task.getTask() + "' due to date error: " + e.getMessage());
    }
}
}

    private boolean shouldSendAlert(long hoursLeft, LocalDateTime lastSent, LocalDateTime now) {
        if (lastSent == null) return true; // Never sent? Send now.
        
        long hoursSinceLastEmail = ChronoUnit.HOURS.between(lastSent, now);

        if (hoursLeft < 24) {
            return hoursSinceLastEmail >= 1; // < 24h: 1hr frequency
        } else if (hoursLeft < 48) {
            return hoursSinceLastEmail >= 2; // Day 2: 2hr frequency
        } else if (hoursLeft < 72) {
            return hoursSinceLastEmail >= 6; // Day 3: 6hr frequency
        } else if (hoursLeft < 96) {
            return hoursSinceLastEmail >= 10; // Day 4: 10hr frequency
        }
        
        return false; // Farther out? No email yet.
    }
}