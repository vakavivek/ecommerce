const API_BASE = '/api';

async function apiRequest(path, options) {
    const response = await fetch(API_BASE + path, options || {});
    if (!response.ok) {
        let detail = '';
        try {
            const body = await response.json();
            detail = body.detail || body.message || '';
        } catch (_) {
            // Use the status message below when the response is not JSON.
        }
        throw new Error(detail || 'Request failed (' + response.status + ').');
    }
    return response.json();
}

async function apiGet(path) {
    return apiRequest(path);
}

function fetchProducts() {
    return apiGet('/products');
}

function searchProducts(keyword) {
    return apiGet('/products/search?keyword=' + encodeURIComponent(keyword));
}

async function getCsrfToken() {
    return apiGet('/csrf');
}

async function mutateCart(path, method, body) {
    const csrf = await getCsrfToken();
    const headers = { [csrf.headerName]: csrf.token };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return apiRequest(path, {
        method: method,
        headers: headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    });
}

function fetchCart() {
    return apiGet('/cart');
}

function addCartItem(productId) {
    return mutateCart('/cart/items/' + productId, 'POST');
}

function updateCartItem(productId, quantity) {
    return mutateCart('/cart/items/' + productId, 'PUT', { quantity: quantity });
}

function removeCartItem(productId) {
    return mutateCart('/cart/items/' + productId, 'DELETE');
}

async function signOut() {
    const csrf = await getCsrfToken();
    await fetch('/logout', { method: 'POST', headers: { [csrf.headerName]: csrf.token } });
    window.location.assign('/login.html?logout=true');
}
