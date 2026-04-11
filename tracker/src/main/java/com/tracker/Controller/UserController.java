package com.tracker.Controller;

import com.tracker.DTO.UserRequest;
import com.tracker.DTO.UserResponse;
import com.tracker.Service.UserService;
import jakarta.validation.Valid;

import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "https://pgtracker.vercel.app")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userService.getAllUsers(pageable);
    }

    @PostMapping
    public UserResponse create(@Valid @RequestBody UserRequest request) {
        return userService.save(request);
    }

    @PutMapping("/{id}")
    public UserResponse update(
        @PathVariable("id") Long id,
        @RequestBody UserRequest request
    ) {
        return userService.update(request, id);
    }

    @DeleteMapping("/{id}") 
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }
}
