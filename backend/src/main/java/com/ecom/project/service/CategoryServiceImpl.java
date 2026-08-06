package com.ecom.project.service;

import com.ecom.project.exception.ApiException;
import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Category;
import com.ecom.project.payload.CategoryDTO;
import com.ecom.project.payload.CategoryResponseDTO;
import com.ecom.project.repo.CategoryRepo;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    public CategoryServiceImpl(CategoryRepo categoryRepo, ModelMapper modelMapper) {
        this.categoryRepo = categoryRepo;
        this.modelMapper = modelMapper;
    }


    @Override
    public CategoryResponseDTO getAllCategories(Integer pageSize,Integer pageNumber,String sortBy,String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                                ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Category> categoryPage = this.categoryRepo.findAll(pageDetails);

        List<Category> categoryList = categoryPage.getContent();
        if(categoryList.isEmpty()){
            throw new ApiException("No categories available");
        }

        List<CategoryDTO> categoryDTOList = categoryList.stream().map(s ->
            modelMapper.map(s, CategoryDTO.class)
        ).toList();

        CategoryResponseDTO categoryResponseDTO = new CategoryResponseDTO();
        categoryResponseDTO.setCategoryDTOList(categoryDTOList);
        categoryResponseDTO.setPageNumber(categoryPage.getNumber());
        categoryResponseDTO.setPageSize(categoryPage.getSize());
        categoryResponseDTO.setTotalElements(categoryPage.getTotalElements());
        categoryResponseDTO.setTotalPages(categoryPage.getTotalPages());
        categoryResponseDTO.setLastPage(categoryPage.isLast());
        return categoryResponseDTO;
    }

    @Override
    public CategoryDTO addCategory(CategoryDTO category) {
        Category categoryModel = modelMapper.map(category, Category.class);
        Optional<Category> categoryOptional = categoryRepo.findByCategoryName(category.getCategoryName());
        if(categoryOptional.isPresent()){
            throw new ApiException("Category is already present with this name: " + category.getCategoryName());
        }

        Category savedCategory = this.categoryRepo.save(categoryModel);
        return modelMapper.map(savedCategory, CategoryDTO.class);

    }

    @Override
    public CategoryDTO updateCategory(long categoryId, CategoryDTO categoryDTO) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResourceNotFoundException("category","categoryId",categoryId));

        c.setCategoryName(categoryDTO.getCategoryName());
        Category updatedCategory = this.categoryRepo.save(c);
        return modelMapper.map(updatedCategory, CategoryDTO.class);

    }

    @Override
    public CategoryDTO deleteCategory(long categoryId) {
        Optional<Category> category = categoryRepo.findById(categoryId);
        Category c = category.orElseThrow(()-> new ResourceNotFoundException("category","categoryId",categoryId));

        this.categoryRepo.delete(c);

        return modelMapper.map(c, CategoryDTO.class);
    }
}
