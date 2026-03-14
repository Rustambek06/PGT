package com.tracker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
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
