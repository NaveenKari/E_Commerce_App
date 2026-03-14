package com.ecom.project.service;

import com.ecom.project.model.Category;

import java.util.List;

public interface CategoryService {

    List<Category> getAllCategories();

    void addCategory(Category category);

    String updateCategory(int categoryId, Category category);

    String deleteCategory(int categoryId);

}
