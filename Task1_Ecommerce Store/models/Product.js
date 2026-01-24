// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'nike-panda'
    name: { type: String, required: true },             // e.g., 'Nike Dunk Low'
    price: { type: Number, required: true },            // e.g., 8295 (Numbers are better for sorting)
    image: { type: String, required: true },            // e.g., 'images/productshoe1.png'
    brand: { type: String, required: true },            // e.g., 'nike', 'adidas'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);