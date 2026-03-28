package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.Entity.Task;
import com.tracker.Entity.User;
import com.tracker.Exceptions.TaskNotFoundException;
import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Mapper.TaskMapper;
import com.tracker.Repository.CategoryRepository;
import com.tracker.Repository.TaskRepository;
import com.tracker.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    public TaskService(
        TaskRepository taskRepository,
        CategoryRepository categoryRepository,
        UserRepository userRepository,
        TaskMapper taskMapper
    ) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.taskMapper = taskMapper;
    }

    public Page<TaskResponse> getAllByUserId(Long userId, Pageable pageable) {
        Page<Task> tasks = taskRepository.findAllByUserId(userId, pageable);

        return tasks.map(taskMapper::toResponse);
    }

    public TaskResponse save(TaskRequest request, Long userId) {
        System.out.println("DEBUG: Starting to save task for user: " + userId);
        Task taskToSave = taskMapper.toEntity(request);

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        taskToSave.setCategory(category);
        
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("User not found"));
        taskToSave.setUser(user);
        
        Task savedTask = taskRepository.save(taskToSave);
        System.out.println("DEBUG: Task saved with ID: " + savedTask.getId());
        return taskMapper.toResponse(savedTask);
    }

    public TaskResponse update(TaskRequest request, Long id) {
        Task taskToUpdate = taskRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        taskToUpdate.setTask(request.getTask());
        taskToUpdate.setDescription(request.getDescription());
        taskToUpdate.setStatus(request.getStatus());
        taskToUpdate.setPriority(request.getPriority());
        taskToUpdate.setCompleted(request.isCompleted());
        taskToUpdate.setDueDate(request.getDueDate());
        taskToUpdate.setCategory(category);

        Task updatedTask = taskRepository.save(taskToUpdate);

        return taskMapper.toResponse(updatedTask);
    }

    public void delete(Long id, Long userId) {
        boolean isTaskExist = taskRepository.existsByIdAndUserId(id, userId);

        if (isTaskExist) {
            taskRepository.deleteById(id);
        } else {
            String message = "Task not found";
            throw new TaskNotFoundException(message);
        }
    }
}
