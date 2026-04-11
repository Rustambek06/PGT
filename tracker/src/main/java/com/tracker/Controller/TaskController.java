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
//@CrossOrigin(origins = "https://pgtracker.vercel.app")
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
        Long userId = userDetails.getId();
        //System.out.println("DEBUG: Requesting tasks for userId: " + userId);
        return taskService.getAllByUserId(userId, pageable);
    }

    @PostMapping
    public TaskResponse create(@AuthenticationPrincipal CustomUserDetails userDetails,
                                @Valid @RequestBody TaskRequest request
    ) {

        //  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //  CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getId();

        return taskService.save(userId, request);
    }

    @PutMapping("/{id}")
    public TaskResponse update(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("id") Long taskId,
        @Valid @RequestBody TaskRequest request
    ) {
        Long userId = userDetails.getId();
        return taskService.update(userId, taskId, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("id") Long taskId
    ) {
        Long userId = userDetails.getId();
        taskService.delete(userId, taskId);
    }
}
