package com.example.server;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServerApplication {

    public static void main(String[] args) {
    // Load .env variables
    Dotenv dotenv = Dotenv.configure()
            .directory("./") // Looks in the root of the server folder
            .ignoreIfMissing()
            .load();

    // Map each entry to a System Property so Spring can find them
    dotenv.entries().forEach(entry -> {
        System.setProperty(entry.getKey(), entry.getValue());
    });

    SpringApplication.run(ServerApplication.class, args);
}
}