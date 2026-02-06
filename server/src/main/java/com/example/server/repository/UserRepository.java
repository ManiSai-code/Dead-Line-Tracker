package com.example.server.repository;

import com.example.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This magic method lets Spring find a user by their name automatically!
    Optional<User> findByUsername(String username);
}