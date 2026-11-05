package com.shop.ecommerce;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByUsernameOrderById(String username);

    Optional<CartItem> findByUsernameAndProductId(String username, int productId);

    void deleteByUsernameAndProductId(String username, int productId);
}
