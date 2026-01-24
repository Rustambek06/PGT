package com.tracker.Service;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.tracker.DTO.UserResponse;
import com.tracker.Entity.User;
import com.tracker.Mapper.UserMapper;
import com.tracker.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
        UserRepository userRepository, 
        UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public Page<UserResponse> getAll(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);

        return users.map(userMapper::toResponse);
    }
}