require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// AUTH: Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) { res.status(500).json({ error: "Error creating user" }); }
});

// AUTH: Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) return res.status(400).json({ error: "Invalid credentials" });
        res.json({ user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POSTS: Get All
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
});

// POSTS: Create New
app.post('/api/posts', async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.json(newPost);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// --- MAGIC SEED ROUTE (Run once to fill DB) ---
app.get('/seed', async (req, res) => {
    try {
        const Post = require('./models/Post');
        // Check if data already exists
        const count = await Post.countDocuments();
        if (count > 0) return res.send("Data already exists! No need to seed.");

        // Create 3 Fake Podcasts
        await Post.create([
            {
                userId: new mongoose.Types.ObjectId(),
                username: "Lex Fridman",
                userAvatar: "https://i.pravatar.cc/150?img=11",
                title: "The Future of AI & Human Nature",
                description: "Exploring the depths of artificial intelligence, consciousness, and what it means to be human in the age of machines.",
                category: "Tech & AI",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                coverImage: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=600",
                likes: 1240
            },
            {
                userId: new mongoose.Types.ObjectId(),
                username: "Indie Hackers",
                userAvatar: "https://i.pravatar.cc/150?img=33",
                title: "How to Bootstrap a $10k/mo Business",
                description: "Real stories from founders who built profitable businesses without VC funding.",
                category: "Startups",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600",
                likes: 850
            },
            {
                userId: new mongoose.Types.ObjectId(),
                username: "Andrew Huberman",
                userAvatar: "https://i.pravatar.cc/150?img=5",
                title: "Master Your Sleep & Energy",
                description: "Science-based tools for better sleep, focus, and productivity.",
                category: "Motivation",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                coverImage: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=600",
                likes: 3200
            }
        ]);
        res.send("✅ Database seeded with 3 Podcasts! Go refresh your dashboard.");
    } catch (err) { res.status(500).send(err.message); }
});
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB (CastCircle)'))
.catch(err => console.error('❌ DB Error:', err));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
