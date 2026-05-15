package com.tracker.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tracker.DTO.HabitRequest;
import com.tracker.DTO.HabitResponse;
import com.tracker.Entity.Habit;
import com.tracker.Entity.User;
import com.tracker.Mapper.HabitMapper;
import com.tracker.Repository.HabitRepository;
import com.tracker.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class HabitService {
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final HabitMapper habitMapper;

    public HabitService(
        HabitRepository habitRepository,
        UserRepository userRepository,
        HabitMapper habitMapper
    ) {
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
        this.habitMapper = habitMapper;
    }

    public Page<HabitResponse> getAllByUserId(Long userId, Pageable pageable) {
        Page<Habit> habits = habitRepository.findAllByUserId(userId, pageable);
        return habits.map(habitMapper::toResponse);
    }

    public HabitResponse save(Long userId, HabitRequest habitRequest) {
        Habit habitToSave = habitMapper.toEntity(habitRequest);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found."));

        habitToSave.setUser(user);

        Habit savedHabit = habitRepository.save(habitToSave);
        return habitMapper.toResponse(savedHabit);
    }

    public HabitResponse update(Long userId, Long habitId, HabitRequest request) {
        Habit habitToUpdate = habitRepository.findByIdAndUserId(habitId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Habit not found"));

        habitToUpdate.setName(request.getName());
        habitToUpdate.setDone(request.isDone());
        habitToUpdate.setDate(request.getDate());

        Habit updatedHabit = habitRepository.save(habitToUpdate);

        return habitMapper.toResponse(updatedHabit);
    }

    public void delete(Long userId, Long habitId) {
        Habit habitToDelete = habitRepository.findByIdAndUserId(habitId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Habit not found."));
        habitRepository.delete(habitToDelete);       
    }
}