package com.ecom.project.controller;

import com.ecom.project.payload.CategoryDTO;
import com.ecom.project.payload.CategoryResponseDTO;
import com.ecom.project.service.CategoryServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ecom.project.config.AppConstants.*;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    public CategoryController(CategoryServiceImpl categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponseDTO> getCategory(@RequestParam(name = "pageNumber",defaultValue = PAGE_NUMBER,required = false) Integer pageNumber,
                                                           @RequestParam(name = "pageSize", defaultValue = PAGE_SIZE,required = false) Integer pageSize,
                                                           @RequestParam(name = "sortBy",defaultValue = CATEGORY_SORT_BY,required = false) String sortBy,
                                                           @RequestParam(name = "sortOrder",defaultValue = SORT_ORDER,required = false) String sortOrder){
        return ResponseEntity.ok(categoryService.getAllCategories(pageSize,pageNumber,sortBy,sortOrder));
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
