package com.tracker.Repository;

import com.tracker.Entity.Note;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long>{
    List<Note> findByCategoryIdOrderByCreatedAtDesc(Long categoryId);
}
