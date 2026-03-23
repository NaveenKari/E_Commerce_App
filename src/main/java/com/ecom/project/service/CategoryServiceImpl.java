package com.ecom.project.service;

import com.ecom.project.exception.ApiException;
import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Category;
import com.ecom.project.repo.CategoryRepo;
import org.springframework.stereotype.Service;
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
        List<Category> categoryList = this.categoryRepo.findAll();
        if(categoryList.isEmpty()){
            throw new ApiException("No categories available");
        }
        return categoryList;
    }

    @Override
    public void addCategory(Category category) {
        Optional<Category> savedCategory = categoryRepo.findByCategoryName(category.getCategoryName());
        if(savedCategory.isPresent()){
            throw new ApiException("Category is already present with this name: " + category.getCategoryName());
        }
        this.categoryRepo.save(category);
    }

    @Override
    public String updateCategory(int categoryId, Category categoryDTO) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResourceNotFoundException("category","categoryId",categoryId));
        c.setCategoryName(categoryDTO.getCategoryName());
        this.categoryRepo.save(c);
        return "updated category with id " + categoryId + "successfully";

    }

    @Override
    public String deleteCategory(int categoryId) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResourceNotFoundException("category","categoryId",categoryId));

        this.categoryRepo.delete(c);

        return "category with " + categoryId + " deleted successfully.";
    }
}
