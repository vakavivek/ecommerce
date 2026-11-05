
package com.shop.ecommerce;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    // Get all products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return new ResponseEntity<>(
                service.getAllProducts(),
                HttpStatus.OK
        );
    }

    // Get product by ID
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(
            @PathVariable int id) {

        Product product = service.getProductById(id);

        if (product != null) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Add a new product
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {

        try {
            Product product1 = service.addProduct(
                    product,
                    imageFile
            );

            return new ResponseEntity<>(
                    product1,
                    HttpStatus.CREATED
            );

        } catch (Exception e) {
            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Get product image
    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(
            @PathVariable int productId) {

        Product product = service.getProductById(productId);

        if (product == null || product.getImageDate() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                product.getImageType()
                        )
                )
                .body(product.getImageDate());
    }

    // Update product
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int id,
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {

        try {
            Product product1 = service.updateProduct(
                    id,
                    product,
                    imageFile
            );

            if (product1 != null) {
                return new ResponseEntity<>(
                        "Updated",
                        HttpStatus.OK
                );
            }

            return new ResponseEntity<>(
                    "Failed to update",
                    HttpStatus.BAD_REQUEST
            );

        } catch (IOException e) {
            return new ResponseEntity<>(
                    e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Delete product
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable int id) {

        Product product = service.getProductById(id);

        if (product != null) {
            service.deleteProduct(id);

            return new ResponseEntity<>(
                    "Deleted",
                    HttpStatus.OK
            );
        }

        return new ResponseEntity<>(
                "Product not found",
                HttpStatus.NOT_FOUND
        );
    }

    // Search products
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String keyword) {

        List<Product> products = service.searchProducts(keyword);

        return new ResponseEntity<>(
                products,
                HttpStatus.OK
        );
    }
}
