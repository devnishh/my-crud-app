package com.crud_app.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crud_app.backend.model.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {
	List<Record> findByActiveAndNameContaining(Boolean active, String name);
	List<Record> findByActive(Boolean active);
	List<Record> findByNameContaining(String name);
}