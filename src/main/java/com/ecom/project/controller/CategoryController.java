package com.ecom.project.controller;

import com.ecom.project.model.Category;
import com.ecom.project.service.CategoryServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    public CategoryController(CategoryServiceImpl categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/public/categories")
    public ResponseEntity<List<Category>> getCategory(){
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/admin/add-category")
    public ResponseEntity<String> addCategory(@Valid @RequestBody Category category){
        categoryService.addCategory(category);
        return ResponseEntity.ok("added successfully");
    }

    @PutMapping("/admin/update-category/{categoryId}")
    public ResponseEntity<String> updateCategory(@PathVariable int categoryId,
                                                 @Valid @RequestBody Category category){
            return ResponseEntity.ok(categoryService.updateCategory(categoryId,category));
    }

    @DeleteMapping("/admin/delete-category/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable int categoryId){
            return ResponseEntity.ok(categoryService.deleteCategory(categoryId));
    }
}
