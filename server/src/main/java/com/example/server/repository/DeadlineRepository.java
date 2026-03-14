package com.example.server.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Deadline;

@Repository
public interface DeadlineRepository extends JpaRepository<Deadline, Long> {
    List<Deadline> findByUserId(Long userId);

    // The 'User_' part tells JPA to join the tables. 
    // Adding the 'False' and 'True' explicitly helps the query engine.
    List<Deadline> findByDueDateAndCompletedFalseAndUser_EmailNotificationsEnabledTrue(String dueDate);
}