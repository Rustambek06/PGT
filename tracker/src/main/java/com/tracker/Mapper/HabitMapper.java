package com.tracker.Mapper;

import org.springframework.stereotype.Component;

import com.tracker.DTO.HabitRequest;
import com.tracker.DTO.HabitResponse;
import com.tracker.Entity.Habit;

@Component
public class HabitMapper {
    
    public Habit toEntity(HabitRequest request) {
        Habit habit = new Habit();

        habit.setName(request.getName());
        habit.setDone(request.isDone());
        habit.setDate(request.getDate());
        
        return habit;
    }

    public HabitResponse toResponse(Habit habit) {
        HabitResponse response = new HabitResponse();

        response.setId(habit.getId());
        response.setName(habit.getName());
        response.setDone(habit.isDone());
        response.setDate(habit.getDate());
    
        return response;
    }
}
