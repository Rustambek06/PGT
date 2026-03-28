package com.tracker.Controller;

import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Service.CustomUserDetails;
import com.tracker.Service.TaskService;
import jakarta.validation.Valid;

import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public Page<TaskResponse> getAllByUserId(
        @AuthenticationPrincipal CustomUserDetails userDetails, 
        Pageable pageable
    ) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        //Long userId = userDetails.getId();
        //System.out.println("DEBUG: Requesting tasks for userId: " + userId);
        return taskService.getAllByUserId(userDetails.getId(), pageable);
    }

    @PostMapping
    public TaskResponse create(@Valid @RequestBody TaskRequest request,
                               @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        //  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //  CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        //  Long userId = userDetails.getId();

        return taskService.save(request, userDetails.getId());
    }

    @PutMapping("/{id}")
    public TaskResponse update(
        @PathVariable("id") Long id,
        @Valid @RequestBody TaskRequest request
    ) {
        return taskService.update(request, id);
    }

    @DeleteMapping("/{id}")
    public void delete(
        @PathVariable("id") Long id, 
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        taskService.delete(id, userDetails.getId());
    }
}
