const API_BASE = '/api';

async function apiGet(path) {
    const response = await fetch(API_BASE + path);
    if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
    }
    return response.json();
}

function fetchProducts() {
    return apiGet('/products');
}

function searchProducts(keyword) {
    return apiGet('/products/search?keyword=' + encodeURIComponent(keyword));
}