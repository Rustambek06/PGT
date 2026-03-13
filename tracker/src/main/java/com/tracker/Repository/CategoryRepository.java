package com.tracker.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tracker.Entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByIdAndUserId(Long id, Long userId);
    Page<Category> findAllByUserId(Long userId, Pageable pageable);
    Optional<Category> findByIdAndUserId(Long id, Long userId);
}
