package com.tracker.Entity;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    private String name;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
    
    private Status status;
    
    @CreatedDate
    @Column(name = "registration_date", nullable = false, updatable = false)
    private Instant registrationTime;

    private String encodedPassword;
    
    public User() {}

    public User (
        String name, 
        String email, 
        Role role, 
        Status status,
        String encodedPassword
    ) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.encodedPassword = encodedPassword;
    }
}
