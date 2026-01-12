package com.tracker.Mapper;

import com.tracker.DTO.TaskRequest;
import com.tracker.DTO.TaskResponse;
import com.tracker.Entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {
    
    public Task toEntity(TaskRequest request) {
        Task task = new Task();

        task.setTask(request.getTask());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        return task;
    }

    public TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTask(task.getTask());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setCompleated(task.isCompleated());
        response.setDueDate(task.getDueDate());
        response.setCategory(task.getCategory());
        response.setCreatedAt(task.getCreatedAt());

        return response;
    }
}
