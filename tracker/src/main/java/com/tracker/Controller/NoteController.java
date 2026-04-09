package com.tracker.Controller;

import com.tracker.DTO.NoteResponse;
import com.tracker.DTO.NoteRequest;
import com.tracker.Service.CustomUserDetails;
import com.tracker.Service.NoteService;
import jakarta.validation.Valid;

import org.springframework.data.domain.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    // @GetMapping
    // public Page<NoteResponse> getAllByUserId(Long userId, Pageable pageable) {
    //     return noteService.getAllByUserId(userId, pageable);
    // }

    @GetMapping
    public Page<NoteResponse> getAll(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam(required = false) Long categoryId,
        Pageable pageable
    ) {
        return noteService.getAllByUserId(userDetails.getId(), categoryId, pageable);
    }

    @PostMapping
    public NoteResponse create(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody NoteRequest request
    ) {
        return noteService.save(userDetails.getId(), request);
    }

    @PutMapping("/{id}")
    public NoteResponse update( 
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable("id") Long taskId,
        @Valid @RequestBody NoteRequest request
    ) {
        Long userId = userDetails.getId();
        return noteService.update(userId, taskId, request);
    }

    @DeleteMapping("/{id}") 
    public void delete(
        @PathVariable("id") Long id, 
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        noteService.delete(userDetails.getId(), id);
    }
}