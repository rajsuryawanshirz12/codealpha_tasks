const API_URL = 'http://localhost:5001/api';

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Success! Please log in.");
            window.location.href = 'login.html';
        } else {
            alert(data.error);
        }
    } catch (err) { alert("Error connecting to server"); }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            alert(data.error);
        }
    } catch (err) { alert("Login failed"); }
}