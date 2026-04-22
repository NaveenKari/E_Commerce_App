package com.ecom.project.service;

import com.ecom.project.exception.ApiException;
import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Cart;
import com.ecom.project.model.Category;
import com.ecom.project.model.Product;
import com.ecom.project.payload.CartDTO;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.payload.ProductResponseDTO;
import com.ecom.project.repo.CartRepository;
import com.ecom.project.repo.CategoryRepo;
import com.ecom.project.repo.ProductRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;
    private final FileServiceImpl fileService;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @Value("${project.image}")
    private String path;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepo categoryRepo, ModelMapper modelMapper, FileServiceImpl fileService, CartRepository cartRepository, CartService cartService) {
        this.productRepository = productRepository;
        this.categoryRepo = categoryRepo;
        this.modelMapper = modelMapper;
        this.fileService = fileService;
        this.cartRepository = cartRepository;
        this.cartService = cartService;
    }

    @Override
    public ProductDTO addProduct(ProductDTO productDTO, Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId", categoryId));

        boolean isProductNotPresent = true;

        for(Product p : category.getProducts()){
            if(p.getProductName().equals(productDTO.getProductName())){
                isProductNotPresent = false;
                break;
            }
        }

        if(isProductNotPresent){
            Product product = modelMapper.map(productDTO, Product.class);

            product.setImage("default.png");
            product.setCategory(category);
            double specialPrice = (product.getPrice()) - (product.getDiscount() * 0.01) * product.getPrice();
            product.setSpecialPrice(specialPrice);

            Product savedProduct = productRepository.save(product);

            return modelMapper.map(savedProduct, ProductDTO.class);
        }
        else{
            throw new ApiException("Product Already Exists");
        }
    }

    @Override
    public ProductResponseDTO getAllProducts(Integer pageNumber,Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);

        Page<Product> productPage = productRepository.findAll(pageDetails);

        List<Product> productList = productPage.getContent();

        List<ProductDTO> productDTOS = productList.stream().map(product ->
             modelMapper.map(product, ProductDTO.class)
        ).toList();

        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);
        productResponseDTO.setPageNumber(productPage.getNumber());
        productResponseDTO.setPageSize(productPage.getSize());
        productResponseDTO.setTotalElements(productPage.getTotalElements());
        productResponseDTO.setTotalPages(productPage.getTotalPages());
        productResponseDTO.setLastPage(productPage.isLast());

        return productResponseDTO;
    }

    @Override
    public ProductResponseDTO getProductsByCategory(Long categoryId,Integer pageNumber,Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);

        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category","categoryId", categoryId));

        Page<Product> productPage = productRepository.findByCategoryOrderByPriceAsc(category,pageDetails);

        List<Product> productList = productPage.getContent();
        List<ProductDTO> productDTOS = productList.stream().map(product ->
                modelMapper.map(product, ProductDTO.class)
        ).toList();
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);
        productResponseDTO.setPageNumber(productPage.getNumber());
        productResponseDTO.setPageSize(productPage.getSize());
        productResponseDTO.setTotalElements(productPage.getTotalElements());
        productResponseDTO.setTotalPages(productPage.getTotalPages());
        productResponseDTO.setLastPage(productPage.isLast());

        return productResponseDTO;
    }

    @Override
    public ProductResponseDTO getProductsByKeyword(String keyword,Integer pageNumber,Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product> productPage = productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%',pageDetails);
        List<Product> productList = productPage.getContent();
        List<ProductDTO> productDTOS = productList.stream().map(product ->
                modelMapper.map(product, ProductDTO.class)
        ).toList();
        ProductResponseDTO productResponseDTO = new ProductResponseDTO();
        productResponseDTO.setProductList(productDTOS);
        productResponseDTO.setPageNumber(productPage.getNumber());
        productResponseDTO.setPageSize(productPage.getSize());
        productResponseDTO.setTotalElements(productPage.getTotalElements());
        productResponseDTO.setTotalPages(productPage.getTotalPages());
        productResponseDTO.setLastPage(productPage.isLast());

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

        List<Cart> carts = cartRepository.findCartsByProductId(productId);

        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(), ProductDTO.class)).collect(Collectors.toList());

            cartDTO.setProducts(products);

            return cartDTO;

        }).toList();

        cartDTOs.forEach(cart -> cartService.updateProductInCarts(cart.getCartId(), productId));

        return modelMapper.map(updatedProduct, ProductDTO.class);


    }

    @Override
    public ProductDTO deleteProduct(Long productId) {
        Product RetrProduct = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product","ProductId",productId));

        List<Cart> carts = cartRepository.findCartsByProductId(productId);
        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

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
        String path = this.path;
        String fileName = this.fileService.uploadImage(path,image);

        // updating the new file name to the product
        product.setImage(fileName);

        Product updatedProduct = productRepository.save(product);
        return modelMapper.map(updatedProduct, ProductDTO.class);
    }
}
