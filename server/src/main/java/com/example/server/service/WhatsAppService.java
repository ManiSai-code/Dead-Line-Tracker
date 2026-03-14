package com.example.server.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value; // Add this import
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    // These will now pull automatically from your .env/properties file
    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.whatsapp.from}")
    private String fromNumber;

    public void sendWhatsAppAlert(String toPhone, String taskName, String dueDate) {
        try {
            // Use the variables (accountSid, authToken) instead of hardcoded strings
            Twilio.init(accountSid, authToken);
            
            String body = "🔔 *DEADLINE REMINDER*\n\n" +
                          "Your task: *" + taskName + "*\n" +
                          "Is due on: _" + dueDate + "_\n\n" +
                          "Please complete it soon!";

            Message.creator(
                new PhoneNumber("whatsapp:" + toPhone),
                new PhoneNumber(fromNumber),
                body
            ).create();
            
            System.out.println("📱 WhatsApp sent to: " + toPhone);
        } catch (Exception e) {
            System.err.println("WhatsApp Error: " + e.getMessage());
        }
    }
}