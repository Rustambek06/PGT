package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.Mapper.CategoryMapper;
import com.tracker.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import com.tracker.Entity.Note;
import com.tracker.Repository.NoteRepository;
import com.tracker.Entity.Task;
import com.tracker.Repository.TaskRepository;

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
    private final TaskRepository taskRepository;

    public CategoryService(
        CategoryRepository categoryRepository,
        CategoryMapper categoryMapper,
        NoteRepository noteRepository,
        TaskRepository taskRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.noteRepository = noteRepository;
        this.taskRepository = taskRepository;
    }

    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream()
            .map(categoryMapper::toResponse)
            .collect(Collectors.toList());
    }

    public List<Note> getNotesByCategory(Long categoryId) {
        List<Note> notesByCategory = noteRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        return notesByCategory;
    }

    public List<Task> getTasksByCategory(Long categoryId) {
        List<Task> taskByCategory = taskRepository.findByCategoryIdOrderByCreatedAtDesc(categoryId);
        return taskByCategory;
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
        categoryRepository.deleteById(id);
    }
}
