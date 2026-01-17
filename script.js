// Product Data
const products = [
    {
        id: 1,
        name: "DNK Yellow Shoes",
        category: "Men",
        price: 120,
        originalPrice: 150,
        image: "images/imgi_8_sports-shoe3-300x300.jpg",
        onSale: true,
        hasOptions: false
    },
    {
        id: 2,
        name: "DNK Blue Shoes",
        category: "Men",
        price: 200,
        priceRange: { min: 200, max: 240 },
        image: "images/imgi_9_sports-shoe1-300x300.jpg",
        onSale: false,
        hasOptions: true
    },
    {
        id: 3,
        name: "Dark Brown Jeans",
        category: "Men",
        price: 150,
        image: "images/imgi_10_product-m-jeans1-300x300.jpg",
        onSale: false,
        hasOptions: false
    },
    {
        id: 4,
        name: "Blue Denim Jeans",
        category: "Women",
        price: 150,
        image: "images/imgi_11_product-w-jeans2-300x300.jpg",
        onSale: false,
        hasOptions: false
    },
    {
        id: 5,
        name: "Basic Gray Jeans",
        category: "Women",
        price: 150,
        image: "images/imgi_12_product-w-jeans4-300x300.jpg",
        onSale: false,
        hasOptions: false
    },
    {
        id: 6,
        name: "Blue Denim Shorts",
        category: "Women",
        price: 130,
        originalPrice: 150,
        image: "images/imgi_13_product-w-jeans1-300x300.jpg",
        onSale: true,
        hasOptions: false
    },
    {
        id: 7,
        name: "Anchor Bracelet",
        category: "Accessories",
        price: 150,
        priceRange: { min: 150, max: 180 },
        image: "images/imgi_14_product-accessory2-300x300.jpg",
        onSale: false,
        hasOptions: true
    },
    {
        id: 8,
        name: "Boho Bangle Bracelet",
        category: "Accessories",
        price: 150,
        priceRange: { min: 150, max: 170 },
        image: "images/imgi_15_product-accessory1-300x300.jpg",
        onSale: false,
        hasOptions: true
    },
    {
        id: 9,
        name: "Light Brown Purse",
        category: "Accessories",
        price: 150,
        image: "images/imgi_16_product-bag1-300x300.jpg",
        onSale: false,
        hasOptions: false
    },
    {
        id: 10,
        name: "Bright Red Bag",
        category: "Accessories",
        price: 100,
        priceRange: { min: 100, max: 140 },
        image: "images/imgi_17_product-bag3-300x300.jpg",
        onSale: false,
        hasOptions: true
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-total');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal && !cartTotalAmount) {
        const totalSpan = cartTotal.querySelector('span:not(.cart-count)');
        if (totalSpan) totalSpan.textContent = `$${totalPrice.toFixed(2)}`;
    }
    if (cartTotalAmount) cartTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;
    
    renderCartContent();
}

function addToCart(product, quantity = 1, options = {}) {
    const existingItem = cart.find(item => 
        item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            options
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showCartNotification();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function renderCartContent() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = '<p>Your cart is empty. Shop now →</p>';
        return;
    }
    
    cartContent.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid #E2E8F0;">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
            <div style="flex: 1;">
                <h4 style="font-size: 14px; margin-bottom: 4px;">${item.name}</h4>
                <p style="font-size: 14px; color: #6366F1; font-weight: 600;">$${item.price.toFixed(2)} × ${item.quantity}</p>
                <button onclick="removeFromCart(${index})" style="margin-top: 8px; background: none; border: none; color: #EF4444; cursor: pointer; font-size: 12px;">Remove</button>
            </div>
        </div>
    `).join('');
}

function showCartNotification() {
    // Simple notification - can be enhanced with SweetAlert if needed
    const notification = document.createElement('div');
    notification.textContent = 'Added to cart';
    notification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #10B981; color: white; padding: 12px 24px; border-radius: 6px; z-index: 3000;';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Cart Sidebar Toggle
function initCartSidebar() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

// Product Rendering
function renderProducts(productsToRender, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            ${product.onSale ? '<span class="product-badge">Sale!</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <div class="product-price">
                    ${product.priceRange 
                        ? `<span class="price-range">$${product.priceRange.min.toFixed(2)} – $${product.priceRange.max.toFixed(2)}</span>`
                        : product.onSale
                            ? `<span class="price-current">$${product.price.toFixed(2)}</span><span class="price-original">$${product.originalPrice.toFixed(2)}</span>`
                            : `<span class="price-current">$${product.price.toFixed(2)}</span>`
                    }
                </div>
                <p class="product-rating">Rated <strong>0</strong> out of 5</p>
                <div class="product-actions">
                    ${product.hasOptions
                        ? `<button class="btn-select-options" onclick="window.location.href='product-detail.html?id=${product.id}'">Select options</button>`
                        : `<button class="btn-add-cart" onclick="addProductToCart(${product.id})">Add to cart</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

// Featured Products on Home Page
function initHomePage() {
    const featuredProducts = products.slice(0, 10);
    renderProducts(featuredProducts, 'featuredProducts');
}

// Store Page Functions
function initStorePage() {
    renderProducts(products, 'productsGrid');
    
    // Filter functionality
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySort);
    }
}

function applyFilters() {
    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
    
    let filtered = products.filter(product => {
        const price = product.priceRange ? product.priceRange.max : product.price;
        return price >= minPrice && price <= maxPrice;
    });
    
    renderProducts(filtered, 'productsGrid');
    updateResultsCount(filtered.length);
}

function applySort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    const sortBy = sortSelect.value;
    let sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => {
                const priceA = a.priceRange ? a.priceRange.min : a.price;
                const priceB = b.priceRange ? b.priceRange.min : b.price;
                return priceA - priceB;
            });
            break;
        case 'price-high':
            sorted.sort((a, b) => {
                const priceA = a.priceRange ? a.priceRange.max : a.price;
                const priceB = b.priceRange ? b.priceRange.max : b.price;
                return priceB - priceA;
            });
            break;
        case 'latest':
            sorted.reverse();
            break;
    }
    
    renderProducts(sorted, 'productsGrid');
}

function updateResultsCount(count) {
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Showing 1–${count} of ${count} results`;
    }
}

function filterByCategory(category) {
    const filtered = category === 'Everything' 
        ? products 
        : products.filter(p => p.category === category);
    
    renderProducts(filtered, 'productsGrid');
    updateResultsCount(filtered.length);
}

// Product Detail Page
function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        // Default to first product if no ID
        const defaultProduct = products[0];
        if (defaultProduct) {
            loadProductDetail(defaultProduct);
        }
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        // If product not found, load first product
        const defaultProduct = products[0];
        if (defaultProduct) {
            loadProductDetail(defaultProduct);
        }
        return;
    }
    
    loadProductDetail(product);
}

function loadProductDetail(product) {
    // Render product detail
    const mainImage = document.getElementById('mainProductImage');
    const productTitle = document.getElementById('productTitle');
    const productPrice = document.getElementById('productPrice');
    const productDescription = document.getElementById('productDescription');
    const productBreadcrumb = document.getElementById('productBreadcrumb');
    const productOptions = document.getElementById('productOptions');
    
    // Get larger image if available
    let imageSrc = product.image;
    if (imageSrc.includes('300x300')) {
        imageSrc = imageSrc.replace('300x300', '1024x1024');
    } else if (imageSrc.includes('400x400')) {
        imageSrc = imageSrc.replace('400x400', '1024x1024');
    }
    
    if (mainImage) mainImage.src = imageSrc;
    if (productTitle) productTitle.textContent = product.name;
    if (productPrice) {
        productPrice.textContent = product.priceRange 
            ? `$${product.priceRange.min.toFixed(2)} – $${product.priceRange.max.toFixed(2)}`
            : product.onSale && product.originalPrice
                ? `$${product.price.toFixed(2)}`
                : `$${product.price.toFixed(2)}`;
    }
    if (productDescription) {
        productDescription.textContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${product.name} is a premium quality product. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`;
    }
    if (productBreadcrumb) productBreadcrumb.textContent = product.name;
    
    // Show/hide options based on product
    if (productOptions) {
        if (product.hasOptions) {
            productOptions.style.display = 'block';
        } else {
            productOptions.style.display = 'none';
        }
    }
    
    // Add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
            const selectedOptions = {};
            
            // Get selected options if any
            if (product.hasOptions) {
                const selectedBtn = document.querySelector('.option-btn.selected');
                if (selectedBtn) {
                    selectedOptions.color = selectedBtn.textContent;
                }
            }
            
            addToCart(product, quantity, selectedOptions);
            closeCart();
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) cartSidebar.classList.add('active');
            const cartOverlay = document.getElementById('cartOverlay');
            if (cartOverlay) cartOverlay.classList.add('active');
        };
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    initCartSidebar();
    
    // Initialize based on current page
    if (document.getElementById('featuredProducts')) {
        initHomePage();
    }
    
    if (document.getElementById('productsGrid')) {
        initStorePage();
    }
    
    if (document.getElementById('productTitle')) {
        initProductDetail();
    }
});

// Helper function to add product by ID
function addProductToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product, 1);
    }
}

// Make functions globally available
window.addToCart = addToCart;
window.addProductToCart = addProductToCart;
window.removeFromCart = removeFromCart;
window.filterByCategory = filterByCategory;
