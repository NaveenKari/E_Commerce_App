package com.ecom.project.service;

import com.ecom.project.model.Product;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    ProductDTO addProduct(ProductDTO product, Long categoryId);

    ProductResponseDTO getAllProducts(Integer pageNumber,Integer pageSize, String sortBy, String sortOrder);

    ProductResponseDTO getProductsByCategory(Long categoryId,Integer pageNumber,Integer pageSize, String sortBy, String sortOrder);

    ProductResponseDTO getProductsByKeyword(String keyword,Integer pageNumber,Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProduct(Long productId, ProductDTO product);

    ProductDTO deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;
}
