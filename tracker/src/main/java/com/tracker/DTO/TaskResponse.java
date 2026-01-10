package com.tracker.DTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import com.tracker.Entity.Category;

@Getter
@Setter
public class TaskResponse {
    private Long id;
    private String task;
    private String description;
    private boolean isCompleated;
    private LocalDateTime dueDate;
    private Category category;
    private LocalDateTime createdAt;
}
