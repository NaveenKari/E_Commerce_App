package com.ecom.project.repo;

import com.ecom.project.model.Category;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CategoryRepo extends JpaRepository<Category, Integer> {
    Optional<Category> findByCategoryName(@NotBlank String categoryName);
}
