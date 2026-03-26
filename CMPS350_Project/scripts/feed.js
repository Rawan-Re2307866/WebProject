import {
  getUsers,
  addUser,
  updateUser,
  getCurrentUser,
  getPosts,
  updatePost,
  getCurrentPostId,
  setCurrentPostId,
  addPost,
  getComments,
  addComment,
  updateComment,
} from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  loadFeed();
});

function loadFeed() {
  const currentUser = getCurrentUser();
  const users = getUsers();
  const allPosts = getPosts();

  const followingPosts = allPosts.filter((post) =>
    currentUser.following.includes(post.userId) && post.userId !== currentUser.id
  );

  const chronologicalPosts = [...followingPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const postContainer = document.querySelector(".post-container");
  postContainer.innerHTML = "";

  if (chronologicalPosts.length === 0) {
    postContainer.innerHTML =
      '<p style="text-align: center; color: #999; padding: 2rem;">No posts from users you follow. Start following people to see their posts!</p>';
    return;
  }

  chronologicalPosts.forEach((post) => {
    const poster = users.find((u) => u.id === post.userId);
    if (!poster) return;

    const postElement = createPostElement(post, poster);
    postContainer.appendChild(postElement);
  });

  attachLikeListeners();
}

function createPostElement(post, poster) {
  const article = document.createElement("article");
  article.className = "post";
  article.dataset.postId = post.postId;

  const postHeader = document.createElement("div");
  postHeader.className = "post-header";
  postHeader.innerHTML = `
        <a href="profile.html?userId=${poster.id}">
    <img src="${poster.profilePicture}" alt="${poster.username} profile picture" class="profile-pic">
  </a>
  <div class="post-user-info">
    <a href="profile.html?userId=${poster.id}">
      <h3 class="username">${poster.username}</h3>
    </a>
    <span class="post-time">${timeAgo(post.createdAt)}</span>
  </div>
    `;


  const postContent = document.createElement("div");
  postContent.className = "post-content";
  if (post.type === "image") {
    postContent.innerHTML = `<img src="${post.content}" alt="Post image" style="width: 100%; object-fit: cover;">`;
  } else {
    postContent.innerHTML = `<p>${post.content}</p>`;
  }

  postContent.style.cursor = "pointer";
  postContent.addEventListener("click", () => {
    window.location.href = `post.html?postId=${post.postId}`;
  });

  const postActions = document.createElement("div");
  postActions.className = "post-actions";
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

<a href="post.html?postId=${post.postId}" class="comment-btn" aria-label="Open comments">            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#83778d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icon-tabler-bubble">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16" />
            </svg>
        </a>
    `;

  const postCaption = document.createElement("div");
  postCaption.className = "post-caption";
  postCaption.innerHTML = `
        <span class="caption-user"><strong>${poster.username}</strong></span>
        <span class="caption-text">${post.caption || ""}</span>
    `;

  article.appendChild(postHeader);
  article.appendChild(postContent);
  article.appendChild(postActions);
  article.appendChild(postCaption);

  return article;
}


function attachLikeListeners() {
  const currentUser = getCurrentUser();
  const allPosts = getPosts();

  const likedKey = `likedPosts_${currentUser.id}`;
  const likedPosts = JSON.parse(localStorage.getItem(likedKey)) || [];

  const likeButtons = document.querySelectorAll(".like-btn");

  likeButtons.forEach((button) => {
    const article = button.closest("article");
    const postId = article.dataset.postId;
    const likeCount = button.nextElementSibling;

    if (likedPosts.includes(postId)) {
      button.classList.add("liked");
    }

    button.addEventListener("click", () => {
      const alreadyLiked = likedPosts.includes(postId);

      if (alreadyLiked) {
        likedPosts.splice(likedPosts.indexOf(postId), 1);
        button.classList.remove("liked");
        likeCount.textContent = parseInt(likeCount.textContent) - 1;
      } else {
        likedPosts.push(postId);
        button.classList.add("liked");
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
      }

      localStorage.setItem(likedKey, JSON.stringify(likedPosts));

      const post = allPosts.find((p) => String(p.postId) === String(postId));
      if (post) {
        post.likes = parseInt(likeCount.textContent);
        updatePost(post);
      }
    });
  });
}

function timeAgo(isoString) {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now - past;

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (day < 1) {
    if (min < 1) return "just now";
    if (min < 60) return `${min}m`;
    return `${hr}h`;
  }

  if (day < 7) {
    return `${day}d`;
  }

  if (day < 30) {
    return `${week}w`;
  }

  if (day < 365) {
    return `${month}mo`;
  }

  return `${year}y`;
}








