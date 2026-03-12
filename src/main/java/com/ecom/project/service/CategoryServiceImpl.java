package com.ecom.project.service;

import com.ecom.project.model.CategoryDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService{

    private final List<CategoryDTO> categories = new ArrayList<>();


    @Override
    public List<CategoryDTO> getAllCategories() {
        return categories;
    }

    @Override
    public void addCategory(CategoryDTO categoryDTO) {
        categoryDTO.setCategoryId(categories.size()+1);
        categories.add(categoryDTO);
    }

    @Override
    public String updateCategory(int categoryId,CategoryDTO categoryDTO) {
        CategoryDTO category = categories.stream().
                filter(c -> c.getCategoryId() == categoryId)
                .findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found"));

        category.setCategoryName(categoryDTO.getCategoryName());

        return "updated category with id " + categoryId + "successfully";

    }

    @Override
    public String deleteCategory(int categoryId) {
        CategoryDTO category = categories.stream()
                        .filter(c-> c.getCategoryId() == categoryId).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found"));

        categories.remove(category);

        return "category with " + categoryId + " deleted successfully.";
    }
}
