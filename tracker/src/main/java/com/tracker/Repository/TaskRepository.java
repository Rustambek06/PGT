package com.tracker.Repository;

import com.tracker.Entity.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
    boolean existsByCategoryId(Long categoryId);
    boolean existsById(Long id);
}
