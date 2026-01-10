package com.tracker.DTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import com.tracker.Entity.Category;

@Getter
@Setter
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private Category category;
    private LocalDateTime createdAt;
}
