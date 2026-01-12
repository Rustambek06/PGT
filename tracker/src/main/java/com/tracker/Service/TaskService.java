package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.Entity.Task;
import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Mapper.TaskMapper;
import com.tracker.Repository.CategoryRepository;
import com.tracker.Repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final TaskMapper taskMapper;

    public TaskService(
        TaskRepository taskRepository,
        CategoryRepository categoryRepository,
        TaskMapper taskMapper
    ) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.taskMapper = taskMapper;
    }

    public List<TaskResponse> getAll() {
        List<Task> tasks = taskRepository.findAll();

        return tasks.stream()
            .map(taskMapper::toResponse)
            .collect(Collectors.toList());
    }

    public TaskResponse save(TaskRequest request) {
        Task taskToSave = taskMapper.toEntity(request);

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        taskToSave.setCategory(category);
        
        Task savedTask = taskRepository.save(taskToSave);

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
        taskToUpdate.setCompleated(request.isCompleated());
        taskToUpdate.setDueDate(request.getDueDate());
        taskToUpdate.setCategory(category);

        Task updatedTask = taskRepository.save(taskToUpdate);

        return taskMapper.toResponse(updatedTask);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
