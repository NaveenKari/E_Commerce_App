package com.ecom.project.repo;

import com.ecom.project.model.Product;
import com.ecom.project.model.User;
import com.ecom.project.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserOrderByAddedDateDesc(User user);

    Optional<WishlistItem> findByUserAndProduct(User user, Product product);

    @Modifying
    @Transactional
    void deleteByUserAndProduct(User user, Product product);
}
