package com.ecom.project.service;

import com.ecom.project.model.Category;
import com.ecom.project.repo.CategoryRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepo categoryRepo;

    public CategoryServiceImpl(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }


    @Override
    public List<Category> getAllCategories() {
        return this.categoryRepo.findAll();
    }

    @Override
    public void addCategory(Category category) {
        this.categoryRepo.save(category);
    }

    @Override
    public String updateCategory(int categoryId, Category categoryDTO) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found"));
        c.setCategoryName(categoryDTO.getCategoryName());
        this.categoryRepo.save(c);
        return "updated category with id " + categoryId + "successfully";

    }

    @Override
    public String deleteCategory(int categoryId) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Category not found"));

        this.categoryRepo.delete(c);

        return "category with " + categoryId + " deleted successfully.";
    }
}
