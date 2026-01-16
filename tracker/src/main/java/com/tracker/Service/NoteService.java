package com.tracker.Service;

import com.tracker.Entity.Category;
import com.tracker.Entity.Note;
import com.tracker.Exceptions.NoteNotFoundException;
import com.tracker.Repository.CategoryRepository;
import com.tracker.Repository.NoteRepository;
import com.tracker.Mapper.NoteMapper;
import com.tracker.DTO.NoteRequest;
import com.tracker.DTO.NoteResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NoteService {
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;
    private final NoteMapper noteMapper;

    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository, NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
        this.noteMapper = noteMapper;
    }

    public List<NoteResponse> getAll() {
        List<Note> notes = noteRepository.findAll();

        return notes.stream()
                .map(noteMapper::toResponse)
                .collect(Collectors.toList());
    }

    public NoteResponse save(NoteRequest request) {
        Note noteToSave = noteMapper.toEntity(request);
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found."));
        noteToSave.setCategory(category);

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

    public void delete(Long id) {
        boolean isNoteExist = noteRepository.existsById(id);

        if (isNoteExist) {
            noteRepository.deleteById(id);
        } else {
            String message = "Note not found";
            throw new NoteNotFoundException(message);
        }
    }   
}
