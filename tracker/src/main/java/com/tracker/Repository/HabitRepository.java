package com.tracker.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tracker.Entity.Habit;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    
}