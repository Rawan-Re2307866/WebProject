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

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const viewingUserId = urlParams.get("userId");




  let profileUser;

  if (viewingUserId) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    profileUser = users.find((u) => u.id === viewingUserId);

    if (!profileUser) {
      alert("User not found");
      window.location.href = "feed.html";
      return;
    }
  } else {
    profileUser = currentUser;
  }
  displayProfile(profileUser, currentUser);
});

function displayProfile(profileUser, currentUser) {
  document.querySelector(".profile-username").textContent =
    profileUser.username;

  document.querySelector(".bio").textContent = profileUser.bio || "No bio yet.";

  document.querySelector(".profile-img").src = profileUser.profilePicture;

  const allPosts = getPosts();
  const userPosts = allPosts.filter((p) => p.userId === profileUser.id);

  document.querySelector(".posts-number .count").textContent = userPosts.length;
  document.querySelector(".followers .count").textContent = (
    profileUser.followers || []
  ).length;
  document.querySelector(".following .count").textContent = (
    profileUser.following || []
  ).length;

  const actionButton = document.querySelector(".edit-btn");

  if (profileUser.id === currentUser.id) {
    actionButton.textContent = "Edit Profile";
    actionButton.onclick = function () {
      window.location.href = "edit.html";
    };
  } else {
    const isFollowing = currentUser.following.includes(profileUser.id);
    actionButton.textContent = isFollowing ? "Unfollow" : "Follow";
    actionButton.onclick = function () {
      toggleFollow(profileUser.id, currentUser);
    };
  }
  displayUserPosts(userPosts, "image");
  setupPostTabs(userPosts);
  const logoutbtn = document.querySelector(".logout-btn");

  logoutbtn.onclick = function () {
  if (confirm("Are you sure you want to log out of this account?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
};

}

function toggleFollow(userId, currentUser) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const currentUserIndex = users.findIndex((u) => u.id === currentUser.id);
  const targetUserIndex = users.findIndex((u) => u.id === userId);

  if (currentUserIndex === -1 || targetUserIndex === -1) return;

  const isFollowing = users[currentUserIndex].following.includes(userId);

  if (isFollowing) {
    users[currentUserIndex].following = users[
      currentUserIndex
    ].following.filter((id) => id !== userId);
    users[targetUserIndex].followers = users[targetUserIndex].followers.filter(
      (id) => id !== currentUser.id,
    );
  } else {
    users[currentUserIndex].following.push(userId);
    users[targetUserIndex].followers.push(currentUser.id);
  }

  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("currentUser", JSON.stringify(users[currentUserIndex]));

  location.reload();
}

function displayUserPosts(posts, filter = "image") {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  const filteredPosts = posts.filter((post) => post.type === filter);

  if (filteredPosts.length === 0) {
    const message =
      filter === "image" ? "No image posts yet" : "No text posts yet";
    postsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 20px;">${message}</p>`;
    return;
  }

  filteredPosts.forEach((post) => {
    const postDiv = document.createElement("Div");
    postDiv.className = "post-profile";
    if (post.type === "image") {
      const img = document.createElement("img");
      img.src = post.content;
      img.alt = "Post";
      postDiv.appendChild(img);
    } else {
      postDiv.innerHTML = `<div style="padding: 1rem; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px;">
                    <p style="font-size: 0.8rem; color: #333; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.content}
                    </p>
                </div>`;
    }

    postDiv.onclick = function () {
      window.location.href = `post.html?postId=${post.postId}`;
    };
    postDiv.style.cursor = "pointer";
    postsContainer.appendChild(postDiv);
  });
}

function setupPostTabs(posts) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const postsContainer = document.getElementById("posts-container");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      tabButtons.forEach((b) => b.classList.remove("active"));

      this.classList.add("active");
      const filter = this.getAttribute("data-tab");

      if (filter === "text") {
        postsContainer.classList.add("text-layout");
      } else {
        postsContainer.classList.remove("text-layout");
      }
      displayUserPosts(posts, filter);
    });
  });
}
