package com.ecom.project.controller;

import com.ecom.project.model.Category;
import com.ecom.project.service.CategoryServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<String> addCategory(@RequestBody Category category){
        categoryService.addCategory(category);
        return ResponseEntity.ok("added successfully");
    }

    @PutMapping("/admin/update-category/{categoryId}")
    public ResponseEntity<String> updateCategory(@PathVariable int categoryId,@RequestBody Category category){
        try{
            return ResponseEntity.ok(categoryService.updateCategory(categoryId,category));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        }
    }

    @DeleteMapping("/admin/delete-category/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable int categoryId){

        try {
            return ResponseEntity.ok(categoryService.deleteCategory(categoryId));
        }catch (ResponseStatusException e){
            return new ResponseEntity<>(e.getReason(),e.getStatusCode());
        }
    }
}
