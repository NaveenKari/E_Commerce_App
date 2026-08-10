package com.ecom.project.service;

import com.ecom.project.model.User;
import com.ecom.project.payload.ProductDTO;

import java.util.List;

public interface WishlistService {
    List<ProductDTO> addToWishlist(User user, Long productId);

    List<ProductDTO> getWishlist(User user);

    List<ProductDTO> removeFromWishlist(User user, Long productId);
}
