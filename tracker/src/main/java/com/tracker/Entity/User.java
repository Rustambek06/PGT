package com.tracker.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String password;
    
    public User() {}

    public User (String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
