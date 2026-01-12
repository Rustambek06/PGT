package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.Mapper.CategoryMapper;
import com.tracker.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import com.tracker.Entity.Note;
import com.tracker.Repository.NoteRepository;
import com.tracker.DTO.NoteResponse;
import com.tracker.Mapper.NoteMapper;
import com.tracker.Entity.Task;
import com.tracker.Exceptions.CategoryInUseException;
import com.tracker.Exceptions.CategoryNotFoundException;
import com.tracker.Repository.TaskRepository;
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

    public CategoryService(
        CategoryRepository categoryRepository,
        CategoryMapper categoryMapper,
        NoteRepository noteRepository,
        NoteMapper noteMapper,
        TaskRepository taskRepository,
        TaskMapper taskMapper
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.noteRepository = noteRepository;
        this.noteMapper = noteMapper;
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream()
            .map(categoryMapper::toResponse)
            .collect(Collectors.toList());
    }

    public List<NoteResponse> getNotesByCategory(Long categoryId) {
        List<Note> notesByCategory = noteRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        return notesByCategory.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByCategory(Long categoryId) {
        List<Task> taskByCategory = taskRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        return taskByCategory.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse save(CategoryRequest request) {
        Category categoryToSave = categoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(categoryToSave);

        return categoryMapper.toResponse(savedCategory);
    }

    public CategoryResponse update(CategoryRequest request, Long id) {
        Category categoryToUpdate = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        
        categoryToUpdate.setName(request.getName());

        Category updatedCategory = categoryRepository.save(categoryToUpdate);

        return categoryMapper.toResponse(updatedCategory);
    }

    public void delete(Long id) {
        boolean isCategoryExist = categoryRepository.existsById(id);

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