package com.shop.ecommerce;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepo cartRepo;
    private final ProductRepo productRepo;

    public CartService(CartItemRepo cartRepo, ProductRepo productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(String username) {
        return toResponse(cartRepo.findAllByUsernameOrderById(username));
    }

    @Transactional
    public CartResponse addOne(String username, int productId) {
        Product product = findAvailableProduct(productId);
        CartItem item = cartRepo.findByUsernameAndProductId(username, productId)
                .orElseGet(() -> new CartItem(username, product, 0));

        if (item.getQuantity() >= product.getStockQuantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is not enough stock for this quantity.");
        }

        item.setQuantity(item.getQuantity() + 1);
        cartRepo.save(item);
        return getCart(username);
    }

    @Transactional
    public CartResponse setQuantity(String username, int productId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1.");
        }

        Product product = findAvailableProduct(productId);
        if (quantity > product.getStockQuantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is not enough stock for this quantity.");
        }

        CartItem item = cartRepo.findByUsernameAndProductId(username, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "This product is not in your cart."));
        item.setQuantity(quantity);
        return getCart(username);
    }

    @Transactional
    public CartResponse remove(String username, int productId) {
        cartRepo.deleteByUsernameAndProductId(username, productId);
        return getCart(username);
    }

    private Product findAvailableProduct(int productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
        if (!product.isProductAvailable() || product.getStockQuantity() < 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This product is out of stock.");
        }
        return product;
    }

    private CartResponse toResponse(List<CartItem> items) {
        List<CartLine> lines = items.stream().map(item -> {
            Product product = item.getProduct();
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartLine(product.getId(), product.getName(), product.getBrand(), product.getPrice(),
                    item.getQuantity(), product.getStockQuantity(), lineTotal);
        }).toList();

        int itemCount = lines.stream().mapToInt(CartLine::quantity).sum();
        BigDecimal total = lines.stream().map(CartLine::lineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(lines, itemCount, total);
    }

    public record CartLine(int productId, String name, String brand, BigDecimal unitPrice,
                            int quantity, int stockQuantity, BigDecimal lineTotal) { }

    public record CartResponse(List<CartLine> items, int itemCount, BigDecimal total) { }
}
