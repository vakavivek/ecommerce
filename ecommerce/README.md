# My Store

A small full-stack e-commerce demo with a Spring Boot backend and a browser-based storefront.

## Features

- Login-protected storefront and product API
- Product listing and keyword search
- Sample products loaded into H2 when the app starts
- Per-user cart stored through Spring Data JPA
- Add items, change quantities, remove items, and view a subtotal
- Stock validation before cart updates
- CSRF-protected cart changes

## Tech stack

- Java 21+
- Spring Boot, Spring MVC, Spring Security, Spring Data JPA
- H2 database
- HTML, CSS, and vanilla JavaScript

## Where the code lives

The project folder is `ecommerce`. The cart and product features are part of this same project:

- `src/main/java/com/shop/ecommerce/` contains both the product classes (`ProductController`, `ProductService`, and `ProductRepo`) and cart classes (`CartController`, `CartService`, `CartItem`, and `CartItemRepo`). There is no separate cart project or product project.
- `src/main/resources/static/` contains the browser pages, styles, and JavaScript. The cart interface is in `index.html` and `js/main.js`.
- `src/main/resources/data` contains the sample product records loaded at startup.

## Run locally

Install Java 21 or newer and Maven. From this project folder, run:

```sh
mvn spring-boot:run
```

Open [http://localhost:8080](http://localhost:8080). If port 8080 is already in use, run:

```sh
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

Then open [http://localhost:8081](http://localhost:8081).

Spring Security prints a temporary development password in the terminal each time the app starts. Sign in with username `user` and that password. The H2 database is in memory, so cart contents reset when the app stops; the sample products are loaded again at startup.

## Main API routes

- `GET /api/products` — list products
- `GET /api/products/search?keyword=...` — search products
- `GET /api/cart` — get the signed-in user's cart
- `POST /api/cart/items/{productId}` — add one item
- `PUT /api/cart/items/{productId}` — set quantity with `{"quantity": 2}`
- `DELETE /api/cart/items/{productId}` — remove an item
- `GET /api/csrf` — obtain the CSRF token used by cart updates
- `POST /logout` — end the signed-in session

The product management API is also present in `ProductController`.

## Resume description

Built a full-stack storefront using Spring Boot, Spring Security, JPA, H2, and vanilla JavaScript. Implemented product search and a per-user shopping cart with quantity controls, stock validation, CSRF-protected REST endpoints, and a responsive storefront.

This demo currently covers browsing and cart management; it does not include checkout, orders, or payment processing.
