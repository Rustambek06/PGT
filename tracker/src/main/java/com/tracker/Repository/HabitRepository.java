package com.tracker.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.tracker.Entity.Habit;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    Page<Habit> findAllByUserId(Long userId, Pageable pageable);
    Optional<Habit> findByIdAndUserId(Long id, Long userId);
}