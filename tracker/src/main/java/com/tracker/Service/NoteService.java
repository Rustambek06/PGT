package com.tracker.Service;

import com.tracker.Entity.Note;
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
    private final NoteMapper noteMapper;

    public NoteService(NoteRepository noteRepository, NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
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
        Note savedNote = noteRepository.save(noteToSave);

        return noteMapper.toResponse(savedNote);
    }

    public NoteResponse update(NoteRequest request, Long id) {
        Note noteToUpdate = noteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        noteToUpdate.setTitle(request.getTitle());
        noteToUpdate.setContent(request.getContent());

        Note updatedNote = noteRepository.save(noteToUpdate);

        return noteMapper.toResponse(updatedNote);
    }

    public void delete(Long id) {
        noteRepository.deleteById(id);
    }   
}
