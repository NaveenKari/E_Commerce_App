package com.ecom.project.service;

import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Category;
import com.ecom.project.model.Product;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import com.ecom.project.repo.CategoryRepo;
import com.ecom.project.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepo categoryRepo, ModelMapper modelMapper) {
        this.productRepository = productRepository;
        this.categoryRepo = categoryRepo;
        this.modelMapper = modelMapper;
    }

    @Override
    public ProductDTO addProduct(ProductDTO productDTO, Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId", categoryId));

        Product product = modelMapper.map(productDTO, Product.class);

        product.setImage("default.png");
        product.setCategory(category);
        double specialPrice = (product.getPrice()) - (product.getDiscount() * 0.01) * product.getPrice();
        product.setSpecialPrice(specialPrice);

        Product savedProduct = productRepository.save(product);

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductResponseDTO getAllProducts() {
        List<Product> productList = productRepository.findAll();

        List<ProductDTO> productDTOS = productList.stream().map(product ->
             modelMapper.map(product, ProductDTO.class)
        ).toList();

        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);

        return productResponseDTO;
    }

    @Override
    public ProductResponseDTO getProductsByCategory(Long categoryId) {

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId", categoryId));

        List<Product> productList = productRepository.findByCategoryOrderByPriceAsc(category);
        List<ProductDTO> productDTOS = productList.stream().map(product ->
                modelMapper.map(product, ProductDTO.class)
        ).toList();
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);

        return productResponseDTO;
    }

    @Override
    public ProductResponseDTO getProductsByKeyword(String keyword) {
        List<Product> productList = productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%');
        List<ProductDTO> productDTOS = productList.stream().map(product ->
                modelMapper.map(product, ProductDTO.class)
        ).toList();
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);

        return productResponseDTO;
    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product RetrProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","ProductId",productId));

        Product product = modelMapper.map(productDTO,Product.class);

        RetrProduct.setProductName(product.getProductName());
        RetrProduct.setDescription(product.getDescription());
        RetrProduct.setDiscount(product.getDiscount());
        RetrProduct.setPrice(product.getPrice());
        RetrProduct.setQuantity(product.getQuantity());
        RetrProduct.setImage(product.getImage());
        RetrProduct.setSpecialPrice(product.getSpecialPrice());
        RetrProduct.setCategory(product.getCategory());

        Product updatedProduct = productRepository.save(RetrProduct);

        return modelMapper.map(updatedProduct, ProductDTO.class);


    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product RetrProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","ProductId",productId));
        productRepository.deleteById(productId);
        return modelMapper.map(RetrProduct, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        //get product from db
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","ProductId",productId));
        //upload image to server
        // get the file name of the image
        String path = "images/";
        String fileName = uploadImage(path,image);

        // updating the new file name to the product
        product.setImage(fileName);

        Product updatedProduct = productRepository.save(product);
        return modelMapper.map(updatedProduct, ProductDTO.class);
    }

    private String uploadImage(String path, MultipartFile image) throws IOException {
        //File names of current/original file
        String originalFileName = image.getOriginalFilename();
        //generate a unique file name
        String randomId = UUID.randomUUID().toString();
        // adhf.jpg --> 13 --> 13.jpg
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));
        String filePath = path + File.separator + fileName;

        //check if path exists or create
        File folder = new File(path);
        if(!folder.exists()) folder.mkdir();

        //upload to server
        Files.copy(image.getInputStream(), Paths.get(filePath));

        return fileName;
    }
}
