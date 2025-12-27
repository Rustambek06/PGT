package com.tracker.DTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
