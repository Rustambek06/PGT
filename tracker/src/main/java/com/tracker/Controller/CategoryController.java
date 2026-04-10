package com.tracker.Controller;

import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.DTO.NoteResponse;
import com.tracker.DTO.TaskResponse;
import com.tracker.Service.CategoryService;
import com.tracker.Service.CustomUserDetails;

import jakarta.validation.Valid;

import org.springframework.data.domain.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public Page<CategoryResponse> getAllByUserId
    (
        @AuthenticationPrincipal CustomUserDetails userDetails, 
        Pageable pageable
    ) {
        Long userId = userDetails.getId();
        
        return categoryService.getAllByUserId(userId, pageable);
    }

    @GetMapping("/{id}/notes")
    public List<NoteResponse> getNotesByCategory
    (
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("id") Long categoryId
    ) {
        Long userId = userDetails.getId();
        List<NoteResponse> notesByCategory = categoryService.getNotesByCategoryAndUserId(userId, categoryId);
        // Должен добавить IDOR Protection (проверку через userId)
        return notesByCategory;
    }

    @GetMapping("/{id}/tasks")
    public List<TaskResponse> getTasksByCategory
    (
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("id") Long categoryId
    ) {
        Long userId = userDetails.getId();
        List<TaskResponse> tasksByCategory = categoryService.getTasksByCategoryAndUserId(userId, categoryId);
        return tasksByCategory;
    }

    @PostMapping
    public CategoryResponse create
    (
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CategoryRequest request
    ) {
        Long userId = userDetails.getId();
        return categoryService.save(userId, request);
    }

    @PutMapping("/{id}/{userId}")
    public CategoryResponse update(
        @AuthenticationPrincipal CustomUserDetails userDetails, 
        @PathVariable("id") Long categoryId,
        @Valid @RequestBody CategoryRequest request
    ) {
        Long userId = userDetails.getId();
        return categoryService.update(userId, categoryId, request);
    }

    @DeleteMapping("/{id}")
    public void delete
    (
        @AuthenticationPrincipal CustomUserDetails userDetails, 
        @PathVariable("id") Long categoryId
    ) {
        Long userId = userDetails.getId();
        categoryService.delete(userId, categoryId);
    }
}
