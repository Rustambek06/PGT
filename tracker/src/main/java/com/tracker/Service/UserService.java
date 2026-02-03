package com.tracker.Service;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.tracker.DTO.UserRequest;
import com.tracker.DTO.UserResponse;
import com.tracker.Entity.User;
import com.tracker.Exceptions.UserNotFoundException;
import com.tracker.Mapper.UserMapper;
import com.tracker.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
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

    public UserResponse save(UserRequest request) {
        User userToSave = userMapper.toEntity(request);
        User savedUser = userRepository.save(userToSave);

        return userMapper.toResponse(savedUser);
    }

    public UserResponse update(UserRequest request, Long id) {
        User userToUpdate = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        userToUpdate.setName(request.getName());
        userToUpdate.setEmail(request.getEmail());
        userToUpdate.setPassword(request.getPassword());

        User upadtedUser = userRepository.save(userToUpdate);
        return userMapper.toResponse(upadtedUser);
    }

    public void delete(Long id) {
        boolean isUserExist = userRepository.existsById(id);

        if (isUserExist) {
            userRepository.deleteById(id);
        } else {
            String message = "User not found";
            throw new UserNotFoundException(message);
        }
    }
}