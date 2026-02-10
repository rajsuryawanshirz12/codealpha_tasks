const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String },
    userAvatar: { type: String },
    
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    audioUrl: { type: String, required: true },
    coverImage: { type: String },
    
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);