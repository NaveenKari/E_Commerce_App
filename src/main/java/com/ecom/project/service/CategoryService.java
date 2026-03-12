package com.ecom.project.service;

import com.ecom.project.model.CategoryDTO;

import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getAllCategories();

    void addCategory(CategoryDTO categoryDTO);

    String updateCategory(int categoryId,CategoryDTO categoryDTO);

    String deleteCategory(int categoryId);

}
