package com.tracker.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tracker.DTO.LoginRequest;
import com.tracker.DTO.UserRequest;
import com.tracker.DTO.UserResponse;
import com.tracker.Entity.User;
import com.tracker.Mapper.UserMapper;
import com.tracker.Repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3001")
public class AuthController {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthController(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody LoginRequest request) {
        return null;
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody String email, String password) {
        return null;
    }
}
