package com.tracker.Service;

import javax.management.RuntimeErrorException;

import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tracker.DTO.LoginRequest;
import com.tracker.DTO.UserRequest;
import com.tracker.Entity.Role;
import com.tracker.Entity.User;
import com.tracker.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getEncodedPassword())) {
            throw new RuntimeException("Неверный пароль");
        }

        return jwtUtils.generateToken(user.getEmail(), user.getId());
    }

    public void register(UserRequest request) {
        boolean isUsernameExists = userRepository.existsByEmail(request.getEmail());

        if (isUsernameExists) {
            throw new RuntimeException("Пользлватель существует");
        } else {
            User user = new User();
            
            user.setEmail(request.getEmail());
            user.setName(request.getName());

            String hash = passwordEncoder.encode(request.getPassword());
            user.setEncodedPassword(hash);

            user.setRole(Role.USER);

            userRepository.save(user);
        }
    }
}
