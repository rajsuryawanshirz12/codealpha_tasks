const API_URL = 'http://localhost:5001/api';
let currentUser = null;
const audioPlayer = new Audio(); // Global Audio Player
let allPostsData = []; // Store posts to enable filtering

// --- 1. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // A. Check Login Status
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(userStr);

    // B. Update Top Right Profile Info
    const profileName = document.querySelector('.user-profile span');
    if(profileName) profileName.innerText = currentUser.username;
    
    const profileImg = document.querySelector('.user-profile img');
    if(profileImg) profileImg.src = `https://i.pravatar.cc/150?img=${currentUser.username.length % 70}`;

    // C. Initialize App
    fetchPosts();
    setupInteractions();
});

// --- 2. NAVIGATION & CLICKS ---
function setupInteractions() {

   // Sidebar Links
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const text = e.currentTarget.innerText.trim();
        
        // Page Redirects
        if(text === "Explore") window.location.href = 'explore.html';
        else if(text === "Notifications") window.location.href = 'notifications.html';
        else if(text === "Home Feed" || text === "Back to Feed") window.location.href = 'index.html';
        
    
            // Category Filtering (Only works on Dashboard)
            else if(document.getElementById('feed-container')) {
                document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
                e.currentTarget.classList.add('active');
                filterPosts(text);
            }
        });
    });

    // Top Nav Icons [Home, Compass, Plus, Bell, User]
    const navIcons = document.querySelectorAll('.nav-btn');
    if(navIcons.length > 0) {
        navIcons[0].onclick = () => window.location.href = 'index.html';       // House
        navIcons[1].onclick = () => window.location.href = 'explore.html';     // Compass
        navIcons[2].onclick = () => window.openModal();                        // Plus
        navIcons[3].onclick = () => window.location.href = 'notifications.html'; // Bell
        navIcons[4].onclick = () => window.location.href = `profile.html?username=${currentUser.username}`; // User
    }

    // Floating Upload Button
    const uploadBtn = document.querySelector('.fa-plus-square');
    if(uploadBtn) uploadBtn.parentElement.onclick = window.openModal;
}

// --- 3. FEED & RENDER ---
async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        allPostsData = await response.json();
        
        // Only try to render if we are on a page with a feed
        if(document.getElementById('feed-container')) {
            renderFeed(allPostsData);
        }
    } catch (err) {
        console.error("Error loading feed:", err);
    }
}

function renderFeed(posts) {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = ''; 

    if(posts.length === 0) {
        feedContainer.innerHTML = '<p style="text-align:center; color:#999;">No episodes found.</p>';
        return;
    }

    posts.forEach(post => {
        const card = createPodcastCard(post);
        feedContainer.appendChild(card);
    });
}

function filterPosts(category) {
    if (category.includes("Network") || category.includes("Categories")) return;
    
    // If "Home" or "Listen Later", show all (simplified)
    if(category === "Home Feed") {
        renderFeed(allPostsData);
        return;
    }

    const filtered = allPostsData.filter(post => {
        if(category === "Tech & AI") return post.category === "Tech" || post.category === "Tech & AI";
        return post.category === category; 
    });
    
    renderFeed(filtered);
}

function createPodcastCard(post) {
    const div = document.createElement('div');
    div.className = 'event-card';
    const randomLikes = Math.floor(Math.random() * 900) + 100;
    
    // We bind clicks to window functions
    div.innerHTML = `
        <div class="card-image">
            <img src="${post.coverImage || 'https://via.placeholder.com/300'}" alt="Cover">
            <div class="play-overlay" onclick="window.playEpisode('${post.title}', '${post.username}', '${post.coverImage}', '${post.audioUrl}')">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="card-details">
            <div class="category-tag ${getCategoryColor(post.category)}">${post.category || 'Podcast'}</div>
            <h3>${post.title}</h3>
            
            <div class="meta-row" style="cursor:pointer;" onclick="window.location.href='profile.html?username=${post.username}'">
                <img src="${post.userAvatar || 'https://i.pravatar.cc/150?img=11'}" class="host-avatar">
                <div>
                    <span class="host-name">${post.username || 'Unknown Host'}</span>
                    <span class="episode-time">Recent Episode</span>
                </div>
            </div>

            <p class="description">${post.description || ''}</p>
            
            <div class="card-footer">
                <button class="btn-play" onclick="window.playEpisode('${post.title}', '${post.username}', '${post.coverImage}', '${post.audioUrl}')">
                    <i class="fas fa-play"></i> Play Episode
                </button>
                <div class="actions">
                    <span class="action-btn"><i class="far fa-heart"></i> ${post.likes || randomLikes}</span>
                    <span class="action-btn"><i class="far fa-bookmark"></i> Save</span>
                </div>
            </div>
        </div>
    `;
    return div;
}

function getCategoryColor(category) {
    if (category === 'Startups') return 'orange';
    if (category === 'Finance') return 'blue';
    if (category === 'Motivation') return 'green';
    return 'purple';
}

// --- 4. AUDIO PLAYER (Global) ---
window.playEpisode = function(title, host, image, url) {
    const player = document.querySelector('.sticky-player');
    const playBtnIcon = document.querySelector('.main-play-btn i');
    
    // Update UI
    if(player) {
        document.querySelector('.player-track img').src = image;
        document.querySelector('.player-track h5').innerText = title;
        document.querySelector('.player-track span').innerText = host;
    }
    
    // Play Audio
    audioPlayer.src = url;
    audioPlayer.play().catch(e => console.log("Audio play error", e));
    
    // Update Icon
    if(playBtnIcon) {
        playBtnIcon.classList.remove('fa-play');
        playBtnIcon.classList.add('fa-pause');
    }
};

// Toggle Play/Pause on Sticky Player
const mainPlayBtn = document.querySelector('.main-play-btn');
if(mainPlayBtn) {
    mainPlayBtn.onclick = () => {
        const icon = mainPlayBtn.querySelector('i');
        if (audioPlayer.paused) {
            audioPlayer.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    };
}

// Progress Bar
audioPlayer.ontimeupdate = () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    const bar = document.querySelector('.progress-fill');
    if(bar) bar.style.width = `${progress}%`;
};

// --- 5. UPLOAD & MODAL (Global) ---
window.openModal = function() { document.querySelector('.modal-overlay').style.display = 'flex'; };
window.closeModal = function() { document.querySelector('.modal-overlay').style.display = 'none'; };

window.uploadPodcast = async function() {
    const title = document.getElementById('p_title').value;
    const desc = document.getElementById('p_desc').value;
    const audio = document.getElementById('p_audio').value;
    const image = document.getElementById('p_image').value;
    const category = document.getElementById('p_category').value;

    if(!title) return alert("Title is required!");

    const newPost = {
        userId: currentUser._id,
        username: currentUser.username, // Uses REAL logged in name
        userAvatar: `https://i.pravatar.cc/150?img=${currentUser.username.length % 70}`,
        title: title,
        description: desc,
        category: category,
        audioUrl: audio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: image || 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=600'
    };

    try {
        await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        });
        window.closeModal();
        fetchPosts(); // Refresh Feed
        alert("Published! 🚀");
    } catch (err) {
        alert("Upload failed!");
    }
};