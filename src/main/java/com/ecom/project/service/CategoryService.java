package com.ecom.project.service;

import com.ecom.project.model.Category;
import com.ecom.project.payload.CategoryDTO;
import com.ecom.project.payload.CategoryResponseDTO;

public interface CategoryService {

    CategoryResponseDTO getAllCategories();

    CategoryDTO addCategory(CategoryDTO category);

    CategoryDTO updateCategory(int categoryId, CategoryDTO category);

    CategoryDTO deleteCategory(int categoryId);

}
