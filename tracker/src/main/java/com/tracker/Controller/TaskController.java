package com.tracker.Controller;

import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Service.TaskService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3001")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getAll() {
        return taskService.getAll();
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
    public void delete(@PathVariable("id") Long id) {
        taskService.delete(id);
    }
}
