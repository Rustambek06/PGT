package com.tracker.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {
    
    @NotNull(message = "Category name is mandatory")
    private String name;
}
