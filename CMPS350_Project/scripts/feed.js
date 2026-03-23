document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    loadFeed();
});

function loadFeed() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const allPosts = JSON.parse(localStorage.getItem('posts')) || [];

    const followingPosts = allPosts.filter(post =>
        currentUser.following.includes(post.userid)
    );

    const shuffledPosts = shuffleArray(followingPosts);

    const postContainer = document.querySelector('.post-container');
    postContainer.innerHTML = '';

    if (shuffledPosts.length === 0) {
        postContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No posts from users you follow. Start following people to see their posts!</p>';
        return;
    }

    shuffledPosts.forEach(post => {
        const poster = users.find(u => u.id === post.userid);
        if (!poster) return; 

        const postElement = createPostElement(post, poster);
        postContainer.appendChild(postElement);
    });


    attachLikeListeners();
}

function createPostElement(post, poster) {
    const article = document.createElement('article');
    article.className = 'post';

    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    postHeader.innerHTML = `
        <img src="${poster.profilePicture}" alt="${poster.username} profile picture" class="profile-pic">
        <div class="post-user-info">
            <h3 class="username">${poster.username}</h3>
        </div>
    `;

    const postContent = document.createElement('div');
    postContent.className = 'post-content';
    if (post.image) {
        postContent.innerHTML = `<img src="${post.image}" alt="Post image" style="width: 100%; object-fit: cover;">`;
    } else {
        postContent.innerHTML = `<p>${post.content}</p>`;
    }

    const postActions = document.createElement('div');
    postActions.className = 'post-actions';
    postActions.innerHTML = `
        <button class="like-btn" aria-label="Like post">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-heart">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
        </button>
        <span class="like-count">${post.likes || 0}</span>

        <a href="post.html?postId=${post.id}" class="comment-btn" aria-label="Open comments">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#83778d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icon-tabler-bubble">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16" />
            </svg>
        </a>
    `;

    const postCaption = document.createElement('div');
    postCaption.className = 'post-caption';
    postCaption.innerHTML = `
        <span class="caption-user"><strong>${poster.username}</strong></span>
        <span class="caption-text">${post.content || ''}</span>
    `;

    article.appendChild(postHeader);
    article.appendChild(postContent);
    article.appendChild(postActions);
    article.appendChild(postCaption);

    return article;
}

function attachLikeListeners() {
    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {
        const likeCount = button.nextElementSibling;
        button.addEventListener("click", () => {
            button.classList.toggle("liked");
            let count = parseInt(likeCount.textContent);
            if (button.classList.contains("liked")) {
                likeCount.textContent = count + 1;
            } else {
                likeCount.textContent = count - 1;
            }
        });
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}