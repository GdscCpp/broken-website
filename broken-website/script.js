

    const cart = [];
    let cartTotal = 0;

    function addToCart(name, price) {
        cart.push({ name, price });
        // BROKEN: Lack of feedback. We should show a message here.
        updateCart();
    }
    
    function updateCart() {
        const cartCount = document.getElementById('cart-count');
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');

        cartCount.innerText = cart.length;
        
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal = 0;
        } else {
            cartItemsDiv.innerHTML = '';
            // 4. TESTING: Logic error under load / string concatenation
            // BROKEN: Resetting a number with a string to cause issues
            cartTotal = ''; 
            cart.forEach(item => {
                cartItemsDiv.innerHTML += `<p>${item.name} - $${item.price.toFixed(2)}</p>`;
                // This will work for one item, but concatenate for more.
                // e.g. '49.99' + 75.00 = '49.9975'
                cartTotal = cartTotal + item.price;
            });
        }
        
        // Try to fix the broken total, but in a hacky way
        let fixedTotal = parseFloat(cartTotal);
        if(isNaN(fixedTotal)) {
           // If it's the concatenated string, it will be NaN.
           // This is a terrible, inefficient way to fix the problem.
           let actualTotal = 0;
           cart.forEach(item => { actualTotal += item.price; });
           fixedTotal = actualTotal;
        }

        cartTotalSpan.innerText = fixedTotal.toFixed(2);
    }
    
    document.getElementById('cart-button').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('hidden');
    });
    
    document.getElementById('close-cart-button').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('hidden');
    });

    // Page navigation logic
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('data-target');
            
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.remove('hidden');
                } else {
                    page.classList.add('hidden');
                }
            });
            // Nav bar now remains static, demonstrating fixed design elements (a partial fix in itself)
        });
    });

    // Initialize first page and nav style on load
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('page-apparel').classList.remove('hidden');
    });

    // 3. IMPLEMENTATION: XSS Vulnerability
    document.getElementById('submit-review').addEventListener('click', () => {
        const reviewText = document.getElementById('review-text').value;
        const reviewsList = document.getElementById('reviews-list');
        const newReview = document.createElement('div');
        newReview.className = 'border p-3 rounded bg-gray-800 text-white';
        // BROKEN: Directly setting innerHTML from user input allows scripts to run.
        // Try submitting this in the review box: <img src=x onerror="alert('XSS Vulnerability!')">
        newReview.innerHTML = reviewText; 
        reviewsList.appendChild(newReview);
        document.getElementById('review-text').value = '';
    });
    
    // 6. MAINTENANCE: Silent failure for contact form
    function showContactForm() {
        document.getElementById('contact-modal').classList.remove('hidden');
    }
    
    document.getElementById('send-contact-form').addEventListener('click', () => {
        document.getElementById('contact-modal').classList.add('hidden');
        // BROKEN: Give fake success message but do nothing in the backend.
        alert('Thank you for your message! We will get back to you... eventually, maybe.');
    });

