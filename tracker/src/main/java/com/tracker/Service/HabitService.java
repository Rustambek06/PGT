package com.tracker.Service;

import org.springframework.stereotype.Service;

import com.tracker.Mapper.HabitMapper;
import com.tracker.Repository.HabitRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitMapper habitMapper;

    public HabitService(
        HabitRepository habitRepository,
        HabitMapper habitMapper
    ) {
        this.habitRepository = habitRepository;
        this.habitMapper = habitMapper;
    }
}