package com.tracker.Mapper;

import com.tracker.Entity.Category;
import com.tracker.DTO.CategoryRequest;
import com.tracker.DTO.CategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    
    public Category toEntity(CategoryRequest request) {
        Category category = new Category();

        category.setName(request.getName());

        return category;
    }

    public CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setName(category.getName());

        return response;
    }
}
