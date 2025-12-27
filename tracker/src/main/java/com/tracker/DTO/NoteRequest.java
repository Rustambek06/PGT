package com.tracker.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteRequest {
    @NotNull(message = "Title is mandatory")
    private String title;

    @NotNull(message = "Content is mandatory")
    private String content;
}
