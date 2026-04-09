package com.tracker.Repository;

import com.tracker.Entity.Task;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
    boolean existsByCategoryId(Long categoryId);
    boolean existsByIdAndUserId(Long id, Long userId);
    Page<Task> findAllByUserId(Long userId, Pageable pageable);
    Optional<Task> findByIdAndUserId(Long id, Long userId);
}
