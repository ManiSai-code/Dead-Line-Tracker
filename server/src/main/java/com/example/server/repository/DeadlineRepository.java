package com.example.server.repository;

import com.example.server.model.Deadline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
List<Deadline> findByUserId(Long userId);
    List<Deadline> findByDueDateAndCompletedFalseAndUser_EmailNotificationsEnabledTrue(String dueDate);
    // This defines the "undefined" method and tells it what to fetch
    @Query("SELECT d FROM Deadline d WHERE d.completed = false")
    List<Deadline> findAllActive();
}