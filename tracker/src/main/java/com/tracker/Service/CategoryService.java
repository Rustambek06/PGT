package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import com.tracker.Mapper.CategoryMapper;
import com.tracker.Repository.CategoryRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors; 

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream()
            .map(categoryMapper::toResponse)
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
        categoryRepository.deleteById(id);
    }
}
