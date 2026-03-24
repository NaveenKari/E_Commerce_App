package com.ecom.project.controller;

import com.ecom.project.model.Category;
import com.ecom.project.payload.CategoryDTO;
import com.ecom.project.payload.CategoryResponseDTO;
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
    public ResponseEntity<CategoryResponseDTO> getCategory(){
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/admin/add-category")
    public ResponseEntity<CategoryDTO> addCategory(@Valid @RequestBody CategoryDTO category){
        CategoryDTO categoryDTO = categoryService.addCategory(category);
        return ResponseEntity.ok(categoryDTO);
    }

    @PutMapping("/admin/update-category/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable int categoryId,
                                                 @Valid @RequestBody CategoryDTO categoryDTO){
            return ResponseEntity.ok(categoryService.updateCategory(categoryId,categoryDTO));
    }

    @DeleteMapping("/admin/delete-category/{categoryId}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable int categoryId){
            return ResponseEntity.ok(categoryService.deleteCategory(categoryId));
    }
}
