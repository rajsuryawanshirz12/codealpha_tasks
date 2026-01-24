// js/user.js

document.addEventListener('DOMContentLoaded', () => {
    updateUserInterface();
});

function updateUserInterface() {
    // 1. Check if user is logged in (saved in localStorage)
    const user = JSON.parse(localStorage.getItem('user'));
    
    // 2. Find the User Icon in the Navbar
    // We look for the image named 'user.svg' to identify the spot
    const userIconImg = document.querySelector('img[src="images/user.svg"]');
    
    if (userIconImg) {
        // Get the parent link <a> tag
        const userLink = userIconImg.parentElement;
        const parentLi = userLink.parentElement; // The <li> container

        if (user) {
            // --- SCENARIO A: USER IS LOGGED IN ---
            // Replace icon with: "Hi, Name | Logout"
            parentLi.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="text-white me-3" style="font-weight: 600; font-size: 14px;">Hi, ${user.name.split(' ')[0]}</span>
                    <a href="#" onclick="logout()" class="btn btn-sm btn-outline-light rounded-pill" style="font-size: 12px;">Logout</a>
                </div>
            `;
        } else {
            // --- SCENARIO B: NO USER ---
            // Make sure the icon links to the Login Page
            userLink.href = "login.html";
        }
    }
}

function logout() {
    // 1. Clear the data
    localStorage.removeItem('user');
    localStorage.removeItem('cart'); // Optional: Clear cart on logout
    
    // 2. Reload page
    window.location.href = "index.html";
}