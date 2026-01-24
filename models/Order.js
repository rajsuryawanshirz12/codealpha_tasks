// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_email: { type: String, required: true }, // Who bought it
    items: [
        {
            product_name: String,
            quantity: Number,
            price: String // e.g. "₹8,295"
        }
    ],
    total_amount: { type: String, required: true }, // e.g. "₹16,590"
    shipping_address: {
        address: String,
        city: String,
        state: String,
        zip: String
    },
    order_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);