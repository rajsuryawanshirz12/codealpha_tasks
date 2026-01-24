// js/wishlist.js

// 1. Initialize Wishlist from LocalStorage
let wishlist = JSON.parse(localStorage.getItem('dropzoneWishlist')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // If we are on the wishlist page, render the items
    if (document.getElementById('wishlist-container')) {
        renderWishlist();
    }
    // On other pages, highlight hearts for items already in wishlist
    restoreWishlistState();
});

// 2. TOGGLE WISHLIST (Add/Remove)
function toggleWishlist(btnElement, id, title, priceStr, img) {
    // Prevent the link from jumping to top
    if(event) event.preventDefault();

    const existingIndex = wishlist.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        // REMOVE from Wishlist
        wishlist.splice(existingIndex, 1);
        setHeartState(btnElement, false);
    } else {
        // ADD to Wishlist
        wishlist.push({ id, title, price: priceStr, img });
        setHeartState(btnElement, true);
    }

    // Save to Memory
    localStorage.setItem('dropzoneWishlist', JSON.stringify(wishlist));
}

// 3. Visual State Manager (Red Heart vs Empty Heart)
function setHeartState(btn, isActive) {
    const icon = btn.querySelector('i');
    if (isActive) {
        btn.classList.add('active-heart');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = '#ff4d4d'; // Red
    } else {
        btn.classList.remove('active-heart');
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = '#ccc'; // Grey
    }
}

// 4. Restore Heart Colors on Page Load
function restoreWishlistState() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(btn => {
        // We look for the ID inside the onclick attribute
        const onclickText = btn.getAttribute('onclick');
        if (onclickText) {
            // Parse ID (second argument in onclick)
            // Format: toggleWishlist(this, 'id', ...)
            const parts = onclickText.split("'");
            if (parts.length > 1) {
                const id = parts[1]; // The ID should be the second item
                if (wishlist.find(item => item.id === id)) {
                    setHeartState(btn, true);
                }
            }
        }
    });
}

// 5. Render Wishlist Page
function renderWishlist() {
    const container = document.getElementById('wishlist-container');
    const emptyMsg = document.getElementById('empty-msg');

    // Filter out the static empty message div so we don't delete it
    // Or simpler: clear everything and re-add empty msg if needed
    container.innerHTML = '';
    
    if (wishlist.length === 0) {
        container.appendChild(emptyMsg);
        emptyMsg.classList.remove('d-none');
        return;
    } else {
        // Keep empty message hidden
        container.appendChild(emptyMsg);
        emptyMsg.classList.add('d-none');
    }

    wishlist.forEach(item => {
        // Create the HTML for each card
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg-3 mb-5';
        col.innerHTML = `
            <div class="product-item">
                <div class="btn-remove-wish" onclick="removeFromWishlist('${item.id}')" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </div>
                
                <a href="product-details.html?id=${item.id}" class="text-decoration-none d-block">
                    <img src="${item.img}" class="img-fluid product-thumbnail">
                    <h3 class="product-title mt-3">${item.title}</h3>
                    <strong class="product-price">${item.price}</strong>
                </a>

                <div class="d-flex justify-content-between align-items-center mt-4">
                    <a href="javascript:void(0);" class="btn-add-cart" 
                       onclick="addToCart(this, '${item.id}', '${item.title}', '${item.price}', '${item.img}')">
                        <i class="fa-solid fa-plus"></i>
                    </a>
                    <a href="checkout.html" class="btn-buy-now">BUY NOW</a>
                </div>
            </div>
        `;
        container.insertBefore(col, emptyMsg); // Add before the empty message div
    });
    
    // Since we dynamically added "Add to Cart" buttons, we need to check their state
    // We can re-use cart.js logic if available, or just let the user click to add
    if(typeof restoreButtonStates === "function") {
        restoreButtonStates();
    }
}

// 6. Remove specific item (Used on Wishlist Page)
function removeFromWishlist(id) {
    const index = wishlist.findIndex(item => item.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('dropzoneWishlist', JSON.stringify(wishlist));
        renderWishlist(); // Re-render to show changes
    }
}