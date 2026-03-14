package com.example.server.service; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendDeadlineAlert(String toEmail, String taskName, String dueDate, String priority) {
    SimpleMailMessage message = new SimpleMailMessage();
    
    message.setFrom("your.email@gmail.com"); 
    message.setTo(toEmail);
    
    // Better Subject Line
    message.setSubject("🚨 Action Required: Your Deadline for '" + taskName + "' is Tomorrow!");
    
    // Richer Email Content
    String emailBody = "Dear User,\n\n" +
            "This is a friendly reminder from your Dead-Line-Tracker. " +
            "One of your tasks is reaching its deadline within the next 24 hours.\n\n" +
            "--------------------------------------------------\n" +
            "📌 TASK DETAILS\n" +
            "--------------------------------------------------\n" +
            "Task Name:   " + taskName + "\n" +
            "Due Date:    " + dueDate + " (Tomorrow)\n" +
            "Priority:    " + priority.toUpperCase() + "\n" +
            "Status:      PENDING\n" +
            "--------------------------------------------------\n\n" +
            "To manage your tasks or mark this as complete, please visit the dashboard:\n" +
            "http://localhost:3000\n\n" + // Update this to your real website URL later!
            "Stay productive,\n" +
            "The Dead-Line-Tracker Team";
            
    message.setText(emailBody);

    mailSender.send(message);
    System.out.println("Detailed alert sent to: " + toEmail);
}
}