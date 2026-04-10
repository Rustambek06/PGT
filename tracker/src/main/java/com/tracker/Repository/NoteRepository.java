package com.tracker.Repository;

import com.tracker.Entity.Note;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long>{
    List<Note> findByCategoryIdAndUserIdOrderByCreatedAtDesc(Long categoryId, Long userId);
    boolean existsByCategoryId(Long categoryId);
    boolean existsByIdAndUserId(Long id, Long userId);
    Page<Note> findAllByUserIdAndCategoryId(Long categoryId, Long userId, Pageable pageable);
    Page<Note> findAllByUserId(Long userId, Pageable pageable);
    Optional<Note> findByIdAndUserId(Long id, Long userId);
}
