package com.tracker.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class TaskRequest {
    @NotNull(message = "Task name is mandatory")
    private String task;

    private String description;

    @NotNull(message = "Task status is mandatory")
    private boolean isCompleated;

    private Long categoryId;

    @NotNull(message = "Completion date is mandatory")
    private LocalDateTime dueDate;
}
