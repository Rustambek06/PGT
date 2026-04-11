package com.tracker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    private String task;
    private String description;
    private String status;
    private String priority;
    
    @Column(name = "is_completed")
    private boolean isCompleted = false;
    private LocalDateTime dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("user-tasks")
    private User user;
    
    private LocalDateTime createdAt = LocalDateTime.now();

    public Task() {}

    public Task(
        String task, 
        String description,
        Category category, 
        LocalDateTime dueDate
    ) {
        this.task = task;
        this.description = description;
        this.category = category;
        this.dueDate = dueDate;
    }

}
