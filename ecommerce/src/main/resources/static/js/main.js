const grid = document.getElementById('product-grid');
const message = document.getElementById('message');
const heading = document.getElementById('heading');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const cartButton = document.getElementById('cart-toggle');
const cartCount = document.getElementById('cart-count');
const cartPanel = document.getElementById('cart-panel');
const cartItems = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const storeView = document.getElementById('store-view');
const logoutButton = document.getElementById('logout-button');

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

function showMessage(text, isError) {
    message.textContent = text;
    message.classList.toggle('error', Boolean(isError));
}

function renderProducts(products) {
    grid.innerHTML = '';

    if (products.length === 0) {
        showMessage('No products found.');
        return;
    }
    showMessage('');

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
        button.addEventListener('click', async function () {
            button.disabled = true;
            try {
                const cart = await addCartItem(p.id);
                renderCart(cart);
                showMessage(p.name + ' added to your cart.');
            } catch (error) {
                showMessage(error.message, true);
            } finally {
                button.disabled = p.stockQuantity <= 0;
            }
        });

        card.append(thumb, brand, name, desc, price, stock, button);
        grid.appendChild(card);
    });
}

function renderCart(cart) {
    cartCount.textContent = cart.itemCount;
    cartItems.innerHTML = '';

    if (cart.items.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Your cart is empty.';
        cartItems.appendChild(empty);
    }

    cart.items.forEach(function (item) {
        const row = document.createElement('article');
        row.className = 'cart-item';

        const details = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = item.name;
        const price = document.createElement('p');
        price.textContent = money.format(item.unitPrice) + ' each';
        details.append(title, price);

        const controls = document.createElement('div');
        controls.className = 'cart-controls';
        const decrease = document.createElement('button');
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', 'Decrease ' + item.name + ' quantity');
        decrease.disabled = item.quantity <= 1;
        decrease.addEventListener('click', function () {
            changeCartItem(item, item.quantity - 1);
        });

        const quantity = document.createElement('span');
        quantity.textContent = item.quantity;

        const increase = document.createElement('button');
        increase.textContent = '+';
        increase.setAttribute('aria-label', 'Increase ' + item.name + ' quantity');
        increase.disabled = item.quantity >= item.stockQuantity;
        increase.addEventListener('click', function () {
            changeCartItem(item, item.quantity + 1);
        });

        const remove = document.createElement('button');
        remove.className = 'remove-item';
        remove.textContent = 'Remove';
        remove.addEventListener('click', function () {
            removeFromCart(item);
        });

        controls.append(decrease, quantity, increase, remove);
        const lineTotal = document.createElement('strong');
        lineTotal.textContent = money.format(item.lineTotal);
        row.append(details, controls, lineTotal);
        cartItems.appendChild(row);
    });

    cartSummary.textContent = 'Subtotal: ' + money.format(cart.total);
}

async function changeCartItem(item, quantity) {
    try {
        renderCart(await updateCartItem(item.productId, quantity));
        showMessage('Cart updated.');
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function removeFromCart(item) {
    try {
        renderCart(await removeCartItem(item.productId));
        showMessage(item.name + ' removed from your cart.');
    } catch (error) {
        showMessage(error.message, true);
    }
}

async function loadCart() {
    try {
        renderCart(await fetchCart());
    } catch (error) {
        showMessage('Could not load your cart. ' + error.message, true);
    }
}

async function loadProducts(keyword) {
    try {
        showMessage('Loading products...');
        const products = keyword ? await searchProducts(keyword) : await fetchProducts();
        heading.textContent = keyword ? 'Results for "' + keyword + '"' : 'All products';
        renderProducts(products);
    } catch (error) {
        grid.innerHTML = '';
        showMessage('Could not load products. ' + error.message, true);
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    loadProducts(input.value.trim());
});

cartButton.addEventListener('click', function () {
    const showingCart = !cartPanel.hidden;
    cartPanel.hidden = showingCart;
    storeView.hidden = !showingCart;
    cartButton.setAttribute('aria-expanded', String(!showingCart));
    if (!showingCart) loadCart();
});

logoutButton.addEventListener('click', async function () {
    logoutButton.disabled = true;
    try {
        await signOut();
    } catch (error) {
        logoutButton.disabled = false;
        showMessage('Could not log out. ' + error.message, true);
    }
});

loadProducts();
loadCart();
