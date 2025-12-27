package com.tracker.Service;

import com.tracker.Entity.Task;
import com.tracker.DTO.TaskResponse;
import com.tracker.DTO.TaskRequest;
import com.tracker.Mapper.TaskMapper;
import com.tracker.Repository.TaskRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskService(
        TaskRepository taskRepository,
        TaskMapper taskMapper
    ) {
        this.taskRepository = taskRepository;
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
        Task savedTask = taskRepository.save(taskToSave);

        return taskMapper.toResponse(savedTask);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
