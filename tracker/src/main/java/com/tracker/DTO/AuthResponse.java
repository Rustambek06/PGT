package com.tracker.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private Long id; // Добавим ID на всякий случай, фронтенду пригодится
}