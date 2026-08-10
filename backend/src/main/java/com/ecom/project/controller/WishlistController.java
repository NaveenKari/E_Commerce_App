package com.ecom.project.controller;

import com.ecom.project.model.User;
import com.ecom.project.payload.ProductDTO;
import com.ecom.project.service.WishlistService;
import com.ecom.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/products/{productId}")
    public ResponseEntity<List<ProductDTO>> addToWishlist(@PathVariable Long productId) {
        User user = authUtil.loggedInUser();
        List<ProductDTO> wishlist = wishlistService.addToWishlist(user, productId);
        return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist() {
        User user = authUtil.loggedInUser();
        List<ProductDTO> wishlist = wishlistService.getWishlist(user);
        return new ResponseEntity<>(wishlist, HttpStatus.OK);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<List<ProductDTO>> removeFromWishlist(@PathVariable Long productId) {
        User user = authUtil.loggedInUser();
        List<ProductDTO> wishlist = wishlistService.removeFromWishlist(user, productId);
        return new ResponseEntity<>(wishlist, HttpStatus.OK);
    }
}
