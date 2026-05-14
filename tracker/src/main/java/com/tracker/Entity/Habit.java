package com.tracker.Entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "habit")
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean isDone;
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference("user-habits")
    private User user;

    public Habit() {}

    public Habit(String name, boolean isDone, LocalDate date) {
        this.name = name;
        this.isDone = isDone;
        this.date = date;
    }
}
