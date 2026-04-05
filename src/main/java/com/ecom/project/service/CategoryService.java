package com.ecom.project.service;

import com.ecom.project.model.Category;
import com.ecom.project.payload.CategoryDTO;
import com.ecom.project.payload.CategoryResponseDTO;

public interface CategoryService {

    CategoryResponseDTO getAllCategories(Integer pageSize,Integer pageNumber,String sortBy,String sortOrder);

    CategoryDTO addCategory(CategoryDTO category);

    CategoryDTO updateCategory(long categoryId, CategoryDTO category);

    CategoryDTO deleteCategory(long categoryId);

}
