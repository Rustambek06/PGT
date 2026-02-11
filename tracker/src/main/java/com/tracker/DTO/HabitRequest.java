package com.tracker.DTO;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HabitRequest {
    @NotNull
    private String name;

    @NotNull
    private boolean isDone;

    @NotNull
    private LocalDate date;
}
