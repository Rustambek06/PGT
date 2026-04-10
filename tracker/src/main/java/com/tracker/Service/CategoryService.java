package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.Mapper.CategoryMapper;
import com.tracker.Repository.CategoryRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.tracker.Entity.Note;
import com.tracker.Repository.NoteRepository;
import com.tracker.DTO.NoteResponse;
import com.tracker.Mapper.NoteMapper;
import com.tracker.Entity.Task;
import com.tracker.Entity.User;
import com.tracker.Exceptions.CategoryInUseException;
import com.tracker.Exceptions.CategoryNotFoundException;
import com.tracker.Exceptions.UserNotFoundException;
import com.tracker.Repository.TaskRepository;
import com.tracker.Repository.UserRepository;
import com.tracker.DTO.TaskResponse;
import com.tracker.Mapper.TaskMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors; 

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;

    public CategoryService(
        CategoryRepository categoryRepository,
        CategoryMapper categoryMapper,
        NoteRepository noteRepository,
        NoteMapper noteMapper,
        TaskRepository taskRepository,
        TaskMapper taskMapper,
        UserRepository userRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
        this.userRepository = userRepository;
    }

    public Page<CategoryResponse> getAllByUserId(Long userId, Pageable pageable) {
        Page<Category> categories = categoryRepository.findAllByUserId(userId, pageable);

        return categories.map(categoryMapper::toResponse);
    }

    public List<NoteResponse> getNotesByCategoryAndUserId(Long userId, Long categoryId) {
        List<Note> notesByCategory = noteRepository.findByCategoryIdAndUserIdOrderByCreatedAtDesc(categoryId, userId);
        return notesByCategory.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByCategoryAndUserId(Long userId, Long categoryId) {
        List<Task> taskByCategory = taskRepository.findByCategoryIdAndUserIdOrderByCreatedAtDesc(userId, categoryId);
        return taskByCategory.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse save(Long userId, CategoryRequest request) {
        Category categoryToSave = categoryMapper.toEntity(request);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found!"));
        categoryToSave.setUser(user);

        Category savedCategory = categoryRepository.save(categoryToSave);

        return categoryMapper.toResponse(savedCategory);
    }

    public CategoryResponse update(Long userId, Long categoryId, CategoryRequest request) {
        Category categoryToUpdate = categoryRepository.findByIdAndUserId(categoryId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        categoryToUpdate.setName(request.getName());
        
        Category updatedCategory = categoryRepository.save(categoryToUpdate);

        return categoryMapper.toResponse(updatedCategory);
    }

    public void delete(Long userId, Long id) {
        // todo: add @RestControllerAdvice
        boolean isCategoryExist = categoryRepository.existsByIdAndUserId(id, userId);

        if (isCategoryExist) {
            boolean isNotesExist = noteRepository.existsByCategoryId(id);
            boolean isTasksExist = taskRepository.existsByCategoryId(id);

            if (isNotesExist || isTasksExist) {
                String message = "Category has linked notes and tasks";
                throw new CategoryInUseException(message);
            }

            categoryRepository.deleteById(id);
        } else {
            String message = "Category not exist";
            throw new CategoryNotFoundException(message);
        }
    }
}