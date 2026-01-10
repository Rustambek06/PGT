package com.tracker.Controller;

import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.DTO.NoteResponse;
import com.tracker.DTO.TaskResponse;
import com.tracker.Service.CategoryService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/api/categories/{id}/notes")
    public List<NoteResponse> getNotesByCategory(@PathVariable("id") Long id) {
        List<NoteResponse> notesByCategory = categoryService.getNotesByCategory(id);
        return notesByCategory;
    }

    @GetMapping("/api/categories/{id}/tasks")
    public List<TaskResponse> getTasksByCategory(@PathVariable("id") Long id) {
        List<TaskResponse> tasksByCategory = categoryService.getTasksByCategory(id);
        return tasksByCategory;
    }

    @PostMapping
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.save(request);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
        @PathVariable("id") Long id,
        @Valid @RequestBody CategoryRequest request
    ) {
        return categoryService.update(request, id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        categoryService.delete(id);
    }
}
