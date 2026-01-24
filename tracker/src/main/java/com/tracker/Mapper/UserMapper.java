package com.tracker.Mapper;

import org.springframework.stereotype.Component;
import com.tracker.DTO.UserRequest;
import com.tracker.DTO.UserResponse;
import com.tracker.Entity.User;

@Component
public class UserMapper {
    public User toEntity(UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return user;
    }
    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
    
        return response;
    }
}
