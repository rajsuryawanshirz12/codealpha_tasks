// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Import Models
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order'); // <--- NEW: Import Order Model

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- THE MASTER LIST (Data to insert) ---
const sampleProducts = [
    { id: 'nike-panda', name: "Nike Dunk Low 'Panda'", price: 8295, image: 'images/productshoe1 (1)-Photoroom.png', brand: 'nike' },
    { id: 'jordan-1-high', name: "Jordan 1 Retro High", price: 16495, image: 'images/productshoe1-Photoroom.png', brand: 'jordan' },
    { id: 'nb-550', name: "New Balance 550", price: 10999, image: 'images/3-Photoroom (1).png', brand: 'newbalance' },
    { id: 'yeezy-350', name: "Yeezy Boost 350 V2", price: 22999, image: 'images/4-Photoroom (1).png', brand: 'yeezy' },
    { id: 'af1', name: "Nike Air Force 1 '07", price: 7495, image: 'images/5-Photoroom (1).png', brand: 'nike' },
    { id: 'jordan-4', name: "Jordan 4 Retro", price: 28499, image: 'images/6-Photoroom (1).png', brand: 'jordan' },
    { id: 'nb-9060', name: "New Balance 9060", price: 14999, image: 'images/7-Photoroom (1).png', brand: 'newbalance' },
    { id: 'samba', name: "Adidas Samba OG", price: 9999, image: 'images/8-Photoroom (1).png', brand: 'adidas' },
    { id: 'converse-70', name: "Converse Chuck 70", price: 5999, image: 'images/9-Photoroom (1).png', brand: 'converse' },
    { id: 'crocs', name: "Crocs Pollex Clog", price: 7999, image: 'images/10-Photoroom (1).png', brand: 'crocs' },
    { id: 'sb-dunk', name: "Nike SB Dunk Low", price: 12495, image: 'images/11-Photoroom (1).png', brand: 'nike' },
    { id: 'jordan-3', name: "Jordan 3 Retro", price: 18995, image: 'images/12-Photoroom (1).png', brand: 'jordan' },
    { id: 'yeezy-slide', name: "Adidas Yeezy Slide", price: 9999, image: 'images/13-Photoroom (1).png', brand: 'yeezy' },
    { id: 'airmax-90', name: "Nike Air Max 90", price: 10295, image: 'images/14-Photoroom (1).png', brand: 'nike' },
    { id: 'vans', name: "Vans Old Skool", price: 4499, image: 'images/15-Photoroom (1).png', brand: 'vans' },
    { id: 'asics', name: "Asics Gel-Lyte III", price: 8999, image: 'images/16-Photoroom (1).png', brand: 'asics' },
    { id: 'blazer', name: "Nike Blazer Mid '77", price: 7995, image: 'images/17-Photoroom (1).png', brand: 'nike' },
    { id: 'jordan-1-low', name: "Jordan 1 Low", price: 8995, image: 'images/18-Photoroom (1).png', brand: 'jordan' },
    { id: 'nb-2002r', name: "New Balance 2002R", price: 12999, image: 'images/19-Photoroom (1).png', brand: 'newbalance' },
    { id: 'forum', name: "Adidas Forum Low", price: 8999, image: 'images/20-Photoroom (1).png', brand: 'adidas' },
    { id: 'converse-puff', name: "Converse Puff Low", price: 4949, image: 'images/21-Photoroom.png', brand: 'converse' }
];

// --- ROUTES ---

// 1. SEED ROUTE (Run this once to populate DB)
app.get('/seed', async (req, res) => {
    try {
        await Product.deleteMany({}); // Clear old data
        await Product.insertMany(sampleProducts); // Insert new data
        res.json({ message: "Database Seeded Successfully with 21 Products!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. API: GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. API: REGISTER USER
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ message: "User Registered Successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

// 4. API: LOGIN USER (Simple Version)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: "Login Successful", user: { name: user.name, email: user.email } });
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. API: PLACE ORDER (New Route!)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.json({ message: "Order Placed Successfully!", orderId: newOrder._id });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order" });
    }
});

// Serve Frontend
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.get('/all-kicks', (req, res) => { res.sendFile(path.join(__dirname, 'all-kicks.html')); });

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`---------------------------------------`);
    console.log(`🚀 DropZone Server running at: http://localhost:${PORT}`);
    console.log(`---------------------------------------`);
});