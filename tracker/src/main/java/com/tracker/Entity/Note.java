package com.tracker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "note")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("user-notes")
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Note() {}

    public Note(String title, String content, Category category, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.createdAt = createdAt;
    }
}
