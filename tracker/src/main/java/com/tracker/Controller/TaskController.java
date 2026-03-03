package com.tracker.Controller;

import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Service.TaskService;
import jakarta.validation.Valid;

import org.springframework.data.domain.*;
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
    public Page<TaskResponse> getAllByUserId(Long userId, Pageable pageable) {
        return taskService.getAllByUserId(userId, pageable);
    }

    @PostMapping
    public TaskResponse create(@Valid @RequestBody TaskRequest request) {
        return taskService.save(request);
    }

    @PutMapping("/{id}")
    public TaskResponse update(
        @PathVariable("id") Long id,
        @Valid @RequestBody TaskRequest request
    ) {
        return taskService.update(request, id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id, Long userId) {
        taskService.delete(id, userId);
    }
}
