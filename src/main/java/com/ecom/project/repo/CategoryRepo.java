package com.ecom.project.repo;

import com.ecom.project.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoryRepo extends JpaRepository<Category, Integer> {
}
