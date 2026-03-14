package com.tracker.Service;

import org.springframework.security.core.userdetails.UserDetails;

import com.tracker.Entity.User;

public class CustomUserDetails implements UserDetails{
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public String getPassword() {
        return user.getEncodedPassword();
    }
}
