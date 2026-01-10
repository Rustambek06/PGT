package com.tracker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
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
    private boolean isCompleated = false;
    private LocalDateTime dueDate;

    @ManyToOne
    private Category category;
    
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
