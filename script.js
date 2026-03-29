const PRODUCTS = [
    { id: 1, name: 'Organic Red Apples', price: 4.50, unit: 'kg', image: 'fruits.png', category: 'fruits' },
    { id: 2, name: 'Fresh Farm Milk', price: 3.20, unit: 'bottle', image: 'dairy_bakery.png', category: 'bakery' },
    { id: 3, name: 'Sourdough Bread', price: 5.00, unit: 'loaf', image: 'dairy_bakery.png', category: 'bakery' },
    { id: 4, name: 'Sun-dried Veggies', price: 6.80, unit: 'pack', image: 'hero_grocery.png', category: 'veggies' },
    { id: 5, name: 'Fresh Berries Mix', price: 8.50, unit: 'box', image: 'fruits.png', category: 'fruits' },
    { id: 6, name: 'Organic Kale', price: 2.90, unit: 'bunch', image: 'hero_grocery.png', category: 'veggies' }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOpenBtn = document.getElementById('cart-open');
    const closeCartBtn = document.querySelector('.close-cart');
    const overlay = document.getElementById('overlay');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCount = document.querySelector('.cart-count');
    const toast = document.getElementById('toast');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.querySelector('.close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const finalTotalEl = document.getElementById('final-total');

    // Filter Elements
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Render Products
    const renderProducts = (categoryField = 'all') => {
        const filteredProducts = categoryField === 'all' 
            ? PRODUCTS 
            : PRODUCTS.filter(p => p.category === categoryField);

        productContainer.innerHTML = filteredProducts.map(product => `
            <div class="product-card animate-in visible">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}<span> / ${product.unit}</span></div>
                    <button class="btn btn-secondary btn-full add-to-cart" data-id="${product.id}">Add to Basket</button>
                </div>
            </div>
        `).join('');
    };

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            renderProducts(category);
        });
    });

    // Toggle Cart
    const toggleCart = () => {
        cartDrawer.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    cartOpenBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    overlay.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Add to Cart Logic
    const addToCart = (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        cart.push(product);
        updateCartUI();
        showToast();
    };

    const updateCartUI = () => {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartCount.textContent = cart.length;
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        finalTotalEl.textContent = `$${total.toFixed(2)}`;
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-msg">Your basket is feeling light...</p>';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        cartItemsList.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <button class="remove-item" onclick="removeFromCart(${index})" style="background:none; border:none; color: #ff5252; cursor:pointer; font-size:0.8rem; display:block; margin-top:0.5rem">Remove</button>
                </div>
            </div>
        `).join('');
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    const showToast = () => {
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2000);
    };

    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        }
    });

    // Open Checkout Modal
    checkoutBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
        checkoutModal.classList.add('active');
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Final Checkout Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = checkoutForm.querySelector('button');
        const originalText = btn.textContent;
        const name = document.getElementById('name').value;
        
        btn.textContent = 'Processing...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert(`Thanks, ${name}! Your fresh harvest is ordered and heading to your address.`);
            cart = [];
            updateCartUI();
            checkoutModal.classList.remove('active');
            overlay.classList.remove('active');
            checkoutForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    renderProducts();

    const refreshAnimations = () => {
        document.querySelectorAll('section, .category-item, .feature-item, .testimonial-card').forEach(el => {
            el.classList.add('animate-in');
            observer.observe(el);
        });
    };

    refreshAnimations();
});
