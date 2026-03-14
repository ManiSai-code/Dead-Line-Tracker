package com.example.server.scheduler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import com.example.server.service.WhatsAppService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.example.server.model.User;
import com.example.server.repository.DeadlineRepository;
//import com.example.server.repository.DeadlineRepository;
import com.example.server.service.EmailService; // <--- This one!
import com.example.server.model.Deadline;
@Component
public class SmartEmailScheduler {

    @Autowired
    private DeadlineRepository repository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private WhatsAppService whatsAppService;
    // Run every hour to check for candidates
     
 // 60000ms = 1 minute for testing
@Scheduled(fixedRate = 60000)
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
    User user = task.getUser();

    // 1. Use the correct getter name: isEmailNotificationsEnabled()
    if (user.isEmailNotificationsEnabled()) { 
        emailService.sendDeadlineAlert(
            user.getEmail(), 
            task.getTask(), 
            task.getDueDate(), 
            task.getPriority()
        );
        System.out.println("✅ EMAIL SENT for: " + task.getTask());
    }

    // 2. This matches your User.java getter: isWhatsappEnabled()
    if (user.isWhatsappEnabled()) {
        String phone = user.getPhoneNumber();
        if (phone != null && !phone.isEmpty()) {
            whatsAppService.sendWhatsAppAlert(phone, task.getTask(), task.getDueDate());
            System.out.println("📱 WHATSAPP SENT for: " + task.getTask());
        }
    }

    task.setLastAlertSentAt(now);
    repository.save(task);
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