package com.tracker.DTO;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HabitResponse {
    private Long id;
    private String name;
    private boolean isDone;
    private LocalDate date;
}
