package com.crud_app.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crud_app.backend.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

}
