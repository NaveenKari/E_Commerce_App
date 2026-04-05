package com.ecom.project.controller;

import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import com.ecom.project.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO product,@PathVariable Long categoryId){
        ProductDTO productDTO = productService.addProduct(product,categoryId);
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponseDTO> getAllProducts(){
        ProductResponseDTO productResponseDTO = productService.getAllProducts();
        return new ResponseEntity<>(productResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponseDTO> getProductsByCategory(@PathVariable Long categoryId){
        ProductResponseDTO productResponseDTO = productService.getProductsByCategory(categoryId);
        return new ResponseEntity<>(productResponseDTO,HttpStatus.OK);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponseDTO> getProductsByCategory(@PathVariable String keyword){
        ProductResponseDTO productResponseDTO = productService.getProductsByKeyword(keyword);
        return new ResponseEntity<>(productResponseDTO,HttpStatus.OK);
    }

    @PutMapping("/admin/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO product){
        ProductDTO productDTO = productService.updateProduct(productId,product);
        return new ResponseEntity<>(productDTO,HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete/product/{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId){
        ProductDTO productDTO = productService.deleteProduct(productId);
        return new ResponseEntity<>(productDTO,HttpStatus.OK);
    }

    @PutMapping("/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId,
                                                         @RequestParam("Image") MultipartFile image) throws IOException {
        ProductDTO productDTO = productService.updateProductImage(productId,image);
        return new ResponseEntity<>(productDTO,HttpStatus.OK);
    }
}
