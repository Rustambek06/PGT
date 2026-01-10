package com.tracker.Controller;

import com.tracker.DTO.NoteResponse;
import com.tracker.DTO.NoteRequest;
import com.tracker.Service.NoteService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteResponse> getAll() {
        return noteService.getAll();
    }

    @PostMapping
    public NoteResponse create(@Valid @RequestBody NoteRequest request) {
        return noteService.save(request);
    }

    @PutMapping("/{id}")
    public NoteResponse update( 
        @PathVariable("id") Long id,
        @Valid @RequestBody NoteRequest request
    ) {
        return noteService.update(request, id);
    }

    @DeleteMapping("/{id}") 
    public void delete(@PathVariable("id") Long id) {
        noteService.delete(id);
    }
}