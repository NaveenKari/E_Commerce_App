package com.ecom.project.service;

import com.ecom.project.model.Product;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductService {
    ProductDTO addProduct(ProductDTO product, Long categoryId);

    ProductResponseDTO getAllProducts();

    ProductResponseDTO getProductsByCategory(Long categoryId);

    ProductResponseDTO getProductsByKeyword(String keyword);

    ProductDTO updateProduct(Long productId, ProductDTO product);

    ProductDTO deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;
}
