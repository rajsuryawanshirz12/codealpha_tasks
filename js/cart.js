// js/cart.js

// 1. Initialize Cart
let cart = JSON.parse(localStorage.getItem('dropzoneCart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-table-body')) renderCart();
    restoreButtonStates();
});

// 2. TOGGLE FUNCTION
function addToCart(btnElement, id, title, priceStr, img) {
    let price = parseInt(priceStr.replace(/[^0-9]/g, ''));
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        // REMOVE ITEM
        cart.splice(existingIndex, 1);
        setButtonState(btnElement, false);
    } else {
        // ADD ITEM
        cart.push({ id, title, price, img, qty: 1 });
        setButtonState(btnElement, true);
    }

    localStorage.setItem('dropzoneCart', JSON.stringify(cart));
    updateCartCount();
}

// 3. VISUAL STATE MANAGER (Plus <-> Check)
function setButtonState(btn, isAdded) {
    // Reset transition
    btn.style.transition = "all 0.3s ease";
    
    if (isAdded) {
        // STATE: ADDED (Green Tick)
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.backgroundColor = '#3b5d50'; // Green
        btn.style.color = '#ffffff';
        btn.classList.add('active-tick');
    } else {
        // STATE: DEFAULT (Black Plus)
        btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btn.style.backgroundColor = '#2f2f2f'; // Black
        btn.style.color = '#ffffff';
        btn.classList.remove('active-tick');
    }
}

// 4. Restore States on Load
function restoreButtonStates() {
    const buttons = document.querySelectorAll('.btn-add-cart');
    buttons.forEach(btn => {
        const onclickText = btn.getAttribute('onclick');
        if (onclickText) {
            const match = onclickText.match(/'([^']+)'/);
            if (match && match[1]) {
                const id = match[1];
                if (cart.find(item => item.id === id)) {
                    setButtonState(btn, true);
                } else {
                    setButtonState(btn, false); 
                }
            }
        }
    });
}

function updateCartCount() { /* Badge logic placeholder */ }

function renderCart() {
    const cartTable = document.getElementById('cart-table-body');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!cartTable) return; 

    cartTable.innerHTML = ''; 
    let grandTotal = 0;

    if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="7" class="text-center py-5">Your cart is empty. <a href="all-kicks.html">Go Shop!</a></td></tr>';
        if(subtotalEl) subtotalEl.innerText = '₹0';
        if(totalEl) totalEl.innerText = '₹0';
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        let row = `
            <tr>
                <td class="product-thumbnail"><img src="${item.img}" alt="Image" class="img-fluid cart-img" style="max-width: 80px;"></td>
                <td class="product-name"><h2 class="h5 text-black">${item.title}</h2></td>
                <td>UK 9</td>
                <td>₹${item.price.toLocaleString('en-IN')}</td>
                <td>
                    <div class="input-group mb-3 d-flex align-items-center quantity-container" style="max-width: 120px; margin: auto;">
                        <div class="input-group-prepend"><button class="btn btn-outline-black decrease" onclick="updateQty(${index}, -1)" type="button">&minus;</button></div>
                        <input type="text" class="form-control text-center quantity-amount" value="${item.qty}" readonly>
                        <div class="input-group-append"><button class="btn btn-outline-black increase" onclick="updateQty(${index}, 1)" type="button">&plus;</button></div>
                    </div>
                </td>
                <td>₹${itemTotal.toLocaleString('en-IN')}</td>
                <td><a href="javascript:void(0)" class="btn btn-black btn-sm" onclick="removeItem(${index})">X</a></td>
            </tr>
        `;
        cartTable.innerHTML += row;
    });

    let formattedTotal = '₹' + grandTotal.toLocaleString('en-IN');
    if(subtotalEl) subtotalEl.innerText = formattedTotal;
    if(totalEl) totalEl.innerText = formattedTotal;
}

function updateQty(index, change) {
    if (cart[index].qty + change > 0) { cart[index].qty += change; } 
    else { cart.splice(index, 1); }
    localStorage.setItem('dropzoneCart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('dropzoneCart', JSON.stringify(cart));
    renderCart();
}