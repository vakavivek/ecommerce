package com.shop.ecommerce;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        return Map.of("headerName", token.getHeaderName(), "token", token.getToken());
    }

    @GetMapping("/cart")
    public CartService.CartResponse getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/cart/items/{productId}")
    public CartService.CartResponse addOne(@PathVariable int productId, Authentication authentication) {
        return cartService.addOne(authentication.getName(), productId);
    }

    @PutMapping("/cart/items/{productId}")
    public CartService.CartResponse setQuantity(@PathVariable int productId,
                                                @RequestBody QuantityRequest request,
                                                Authentication authentication) {
        return cartService.setQuantity(authentication.getName(), productId, request.quantity());
    }

    @DeleteMapping("/cart/items/{productId}")
    public CartService.CartResponse remove(@PathVariable int productId, Authentication authentication) {
        return cartService.remove(authentication.getName(), productId);
    }

    public record QuantityRequest(int quantity) { }
}
