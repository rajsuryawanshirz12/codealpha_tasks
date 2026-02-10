const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real app, we hash this!
    profilePic: { type: String, default: "https://via.placeholder.com/150" }, // Default Avatar
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of people following me
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // List of people I follow
});

module.exports = mongoose.model('User', UserSchema);