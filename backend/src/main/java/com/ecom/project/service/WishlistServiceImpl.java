package com.ecom.project.service;

import com.ecom.project.exception.ApiException;
import com.ecom.project.exception.ResourceNotFoundException;
import com.ecom.project.model.Product;
import com.ecom.project.model.User;
import com.ecom.project.model.WishlistItem;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.repo.ProductRepository;
import com.ecom.project.repo.WishlistItemRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ProductDTO> addToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        wishlistItemRepository.findByUserAndProduct(user, product).ifPresent(item -> {
            throw new ApiException(product.getProductName() + " is already in your wishlist");
        });

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);
        wishlistItemRepository.save(item);

        return getWishlist(user);
    }

    @Override
    public List<ProductDTO> getWishlist(User user) {
        List<WishlistItem> items = wishlistItemRepository.findByUserOrderByAddedDateDesc(user);
        return items.stream()
                .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public List<ProductDTO> removeFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        wishlistItemRepository.deleteByUserAndProduct(user, product);

        return getWishlist(user);
    }
}
