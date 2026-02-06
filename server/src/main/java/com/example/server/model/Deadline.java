package com.example.server.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Deadline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String task;
    private String dueDate;
    private String priority; // 1. Added the new field
    private boolean completed;
    @ManyToOne
@JoinColumn(name = "user_id")
private User user;
    public Deadline() {}
    @ManyToOne
    @JoinColumn(name = "user_id")
    

    // 2. The MISSING SETTER (Add this exactly as shown)
    public void setUser(User user) {
        this.user = user;
    }

    // 3. The GETTER (Add this too)
    public User getUser() {
        return user;
    }
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    // 2. Added Priority Getter and Setter
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public boolean isCompleted() { return completed; }
public void setCompleted(boolean completed) { this.completed = completed; }
}