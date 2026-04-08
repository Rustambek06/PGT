package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.Entity.Note;
import com.tracker.Entity.User;
import com.tracker.Exceptions.NoteNotFoundException;
import com.tracker.Repository.CategoryRepository;
import com.tracker.Repository.NoteRepository;
import com.tracker.Repository.UserRepository;
import com.tracker.Mapper.NoteMapper;
import com.tracker.DTO.NoteRequest;
import com.tracker.DTO.NoteResponse;
import com.tracker.Utils.SecurityUtils;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class NoteService {
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    public NoteService(
        NoteRepository noteRepository, 
        CategoryRepository categoryRepository, 
        UserRepository userRepository,
        NoteMapper noteMapper
    ) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.noteMapper = noteMapper;
    }

    public Page<NoteResponse> getAllByUserId(Long userId, Long categoryId, Pageable pageable) {
        // Long userId = SecurityUtils.getCurrentUserId();
        
        Page<Note> notes;
        if (categoryId != null) {
            notes = noteRepository.findAllByUserIdAndCategoryId(userId, categoryId, pageable);
        } else {
            notes = noteRepository.findAllByUserId(userId, pageable);
        }
        
        return notes.map(noteMapper::toResponse);
    }

    public NoteResponse save(Long userId, NoteRequest request) {
        Note noteToSave = noteMapper.toEntity(request);
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        noteToSave.setCategory(category);

        User user = userRepository.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("User not found"));
        noteToSave.setUser(user);

        Note savedNote = noteRepository.save(noteToSave);
        return noteMapper.toResponse(savedNote);
    }

    public NoteResponse update(NoteRequest request, Long id) {
        Note noteToUpdate = noteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        noteToUpdate.setTitle(request.getTitle());
        noteToUpdate.setContent(request.getContent());

        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        noteToUpdate.setCategory(category);

        Note updatedNote = noteRepository.save(noteToUpdate);

        return noteMapper.toResponse(updatedNote);
    }

    public void delete(Long userId, Long id) {
        boolean isNoteExist = noteRepository.existsByIdAndUserId(id, userId);

        if (isNoteExist) {
            noteRepository.deleteById(id);
        } else {
            String message = "Note not found";
            throw new NoteNotFoundException(message);
        }
    }   
}
