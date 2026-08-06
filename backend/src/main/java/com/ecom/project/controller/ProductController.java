package com.ecom.project.controller;

import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import com.ecom.project.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.ecom.project.config.AppConstants.*;
import static com.ecom.project.config.AppConstants.SORT_ORDER;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO product,
                                                 @PathVariable Long categoryId){
        ProductDTO productDTO = productService.addProduct(product,categoryId);
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponseDTO> getAllProducts(@RequestParam(name = "pageNumber",defaultValue = PAGE_NUMBER,required = false) Integer pageNumber,
                                                             @RequestParam(name = "pageSize", defaultValue = PAGE_SIZE,required = false) Integer pageSize,
                                                             @RequestParam(name = "sortBy",defaultValue = PRODUCT_SORT_BY,required = false) String sortBy,
                                                             @RequestParam(name = "sortOrder",defaultValue = SORT_ORDER,required = false) String sortOrder){
        ProductResponseDTO productResponseDTO = productService.getAllProducts(pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponseDTO> getProductsByCategory(@PathVariable Long categoryId,
                                                                    @RequestParam(name = "pageNumber",defaultValue = PAGE_NUMBER,required = false) Integer pageNumber,
                                                                    @RequestParam(name = "pageSize", defaultValue = PAGE_SIZE,required = false) Integer pageSize,
                                                                    @RequestParam(name = "sortBy",defaultValue = PRODUCT_SORT_BY,required = false) String sortBy,
                                                                    @RequestParam(name = "sortOrder",defaultValue = SORT_ORDER,required = false) String sortOrder){
        ProductResponseDTO productResponseDTO = productService.getProductsByCategory(categoryId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponseDTO,HttpStatus.OK);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponseDTO> getProductsByKeyword(@PathVariable String keyword,
                                                                   @RequestParam(name = "pageNumber",defaultValue = PAGE_NUMBER,required = false) Integer pageNumber,
                                                                   @RequestParam(name = "pageSize", defaultValue = PAGE_SIZE,required = false) Integer pageSize,
                                                                   @RequestParam(name = "sortBy",defaultValue = PRODUCT_SORT_BY,required = false) String sortBy,
                                                                   @RequestParam(name = "sortOrder",defaultValue = SORT_ORDER,required = false) String sortOrder){
        ProductResponseDTO productResponseDTO = productService.getProductsByKeyword(keyword,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponseDTO,HttpStatus.OK);
    }

    @PutMapping("/admin/product/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId,
                                                    @Valid @RequestBody ProductDTO product){
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
