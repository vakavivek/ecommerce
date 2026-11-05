const grid = document.getElementById('product-grid');
const message = document.getElementById('message');
const heading = document.getElementById('heading');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function renderProducts(products) {
    grid.innerHTML = '';

    if (products.length === 0) {
        message.textContent = 'No products found.';
        return;
    }
    message.textContent = '';

    products.forEach(function (p) {
        const card = document.createElement('article');
        card.className = 'card';

        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        thumb.textContent = p.name.charAt(0);

        const brand = document.createElement('div');
        brand.className = 'brand';
        brand.textContent = p.brand;

        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = p.name;

        const desc = document.createElement('div');
        desc.className = 'desc';
        desc.textContent = p.description;

        const price = document.createElement('div');
        price.className = 'price';
        price.textContent = money.format(p.price);

        const stock = document.createElement('div');
        stock.className = 'stock ' + (p.stockQuantity > 0 ? 'in' : 'out');
        stock.textContent = p.stockQuantity > 0 ? 'In stock (' + p.stockQuantity + ')' : 'Out of stock';

        const button = document.createElement('button');
        button.textContent = 'Add to cart';
        button.disabled = p.stockQuantity <= 0;

        card.append(thumb, brand, name, desc, price, stock, button);
        grid.appendChild(card);
    });
}

async function loadProducts(keyword) {
    try {
        message.textContent = 'Loading...';
        const products = keyword ? await searchProducts(keyword) : await fetchProducts();
        heading.textContent = keyword ? 'Results for "' + keyword + '"' : 'All products';
        renderProducts(products);
    } catch (err) {
        grid.innerHTML = '';
        message.textContent = 'Could not load products. Is the server running?';
        console.error(err);
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    loadProducts(input.value.trim());
});

loadProducts();