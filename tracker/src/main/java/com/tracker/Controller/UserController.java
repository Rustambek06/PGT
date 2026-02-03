package com.tracker.Controller;

import com.tracker.DTO.UserRequest;
import com.tracker.DTO.UserResponse;
import com.tracker.Service.UserService;
import jakarta.validation.Valid;

import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserResponse> getAll(Pageable pageable) {
        return userService.getAll(pageable);
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
