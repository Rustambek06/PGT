package com.tracker.Controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.tracker.DTO.HabitResponse;
import com.tracker.Service.CustomUserDetails;
import com.tracker.Service.HabitService;

@Controller
@RequestMapping("/api/habits")
public class HabitController {
    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping
    public Page<HabitResponse> getAll(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        Pageable pageable
    ) {
        Long userId = userDetails.getId();

        return habitService.getAllByUserId(userId, pageable);
    }
}
