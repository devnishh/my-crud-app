package com.crud_app.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crud_app.backend.model.Record;
import com.crud_app.backend.repository.RecordRepository;

@Service
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;

    public Record create(Record record) {
        return recordRepository.save(record);
    }

    public List<Record> getAll(Boolean active, String name) {
        if (active != null && name != null) {
            return recordRepository.findByActiveAndNameContaining(active, name);
        } else if (active != null) {
            return recordRepository.findByActive(active);
        } else if (name != null) {
            return recordRepository.findByNameContaining(name);
        }
        return recordRepository.findAll();
    }

    public Record getById(Long id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    public Record update(Long id, Record record) {
        Record existing = getById(id);
        existing.setName(record.getName());
        existing.setDescription(record.getDescription());
        existing.setCategory(record.getCategory());
        existing.setActive(record.isActive());
        return recordRepository.save(existing);
    }

    public void delete(Long id) {
        Record record = getById(id);
        recordRepository.delete(record);
    }

    public void bulkDelete(List<Long> ids) {
        recordRepository.deleteAllById(ids);
    }
}