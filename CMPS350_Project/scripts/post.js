import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"

/* Post Display */
document.addEventListener("DOMContentLoaded",  () => {
    const currentUser = getCurrentUser()
if (!currentUser) {
  window.location.href = "login.html"
  return
}

const params = new URLSearchParams(window.location.search)
const postIdParam = params.get("postId")

if (!postIdParam) {
  alert("No Post Id Provided")
  window.location.href = "feed.html"
  return
}

const postId = parseInt(postIdParam, 10)
const posts = getPosts()
const users = getUsers()

const post = posts.find( (p) => p.postId === postId)
if(!post) {
  alert("No Post Found")
  window.location.href = "feed.html"
  return
}

const poster = users.find( (u) => u.id === post.userId)

const posterLinks = document.querySelectorAll(".poster")
posterLinks.forEach((link) => {
  link.href = `profile.html?userId=${poster.id}`;
})

const postPage = document.querySelector(".post-page")
const profilePic = document.querySelector(".profile-pic");
const username = document.querySelector(".username");
const content = document.querySelector(".content");
const likeBtn = document.querySelector(".like-btn");
const likeCount = document.querySelector(".like-count");
const captionUser = document.querySelector(".caption-user");
const captionText = document.querySelector(".caption-text");
const commentsPart = document.querySelector(".comments-part")
const postTime = document.querySelector(".post-time")

username.textContent = poster.username
profilePic.src = poster.profilePicture
postTime.textContent = timeAgo(post.createdAt)

if (post.type === "text") {
  content.innerHTML = `<p>${post.content}</p>`
}
else if (post.type === "image") {
  content.innerHTML = `<img src="${post.content}" alt="Post image">`
}

likeCount.textContent = post.likes ?? 0;
captionUser.textContent = poster ? poster.username : "";
captionText.textContent = post.caption || "";

const likedKey = `likedPosts_${currentUser.id}`;
const likedPosts = JSON.parse(localStorage.getItem(likedKey)) || [];
const postIdStr = String(post.postId);

if (likedPosts.includes(postIdStr)) {
  likeBtn.classList.add("liked");
}

likeBtn.addEventListener("click", () => {
  const alreadyLiked = likedPosts.includes(postIdStr);

  if (alreadyLiked) {
    likedPosts.splice(likedPosts.indexOf(postIdStr), 1);
    likeBtn.classList.remove("liked");
    post.likes = (post.likes ?? 0) - 1;
  } else {
    likedPosts.push(postIdStr);
    likeBtn.classList.add("liked");
    post.likes = (post.likes ?? 0) + 1;
  }

  likeCount.textContent = post.likes;
  localStorage.setItem(likedKey, JSON.stringify(likedPosts));
  updatePost(post);
});

if (post.type === "text") {
  content.classList.add("post-text")
  postPage.classList.add("text")
  commentsPart.classList.add("text")
  content.classList.remove("post")
}
else if (post.type === "image") {
  content.classList.add("post")
  content.classList.remove("post-text")
}


  const commentsContainer = document.querySelector(".other-comments")
  const comments = getComments()
  const postComments = comments.filter((c) => c.postId === postId)
  postComments.forEach(renderComment)
  const commentInput = document.querySelector('.comment-here')
  const commentText = document.querySelector('#comment')
 


  commentInput.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = commentText.value.trim();

  if (!text) return
  
  const newComment = {
    commentId: Date.now(),
    postId: postId,
    userId: currentUser.id,
    username: currentUser.username,
    content: text,
    createdAt: new Date().toISOString()
  }

  addComment(newComment)

  renderComment(newComment)

  commentText.value= " "
  
});

function renderComment(comment) {

  const divItem = document.createElement("div")
  divItem.classList.add("comment-item")
  divItem.style.cssText = "margin: 10px 0; padding: 8px; background: none; font-size: small;"

  const commentTime = timeAgo(comment.createdAt)


  divItem.innerHTML = `
  <a href="profile.html?userId=${comment.userId}" class="comment-user-link">
    <strong>${comment.username}</strong>
  </a>
  <span style="margin-left: 4px;">${comment.content}</span>
  <span class="comment-time">${commentTime}</span>
`

  commentsContainer.appendChild(divItem)
}

const menuBtn = document.querySelector(".menu-btn");
const menuCloseBtn = document.querySelector(".menu-close-btn");
const menuBar = document.querySelector(".menu-bar");
const deleteBtn = document.querySelector(".delete-post-btn")
const editBtn = document.querySelector(".edit-post-btn")

if (post.userId === currentUser.id) {
  
  menuBtn.addEventListener('click', () => { 
      menuBar.classList.add('display');
      menuCloseBtn.classList.add('close');

      deleteBtn.addEventListener("click", () => {
        if (!confirm("Delete this post?")) return
        const remaining = posts.filter((p) => p.postId!== post.postId)
        localStorage.setItem("posts", JSON.stringify(remaining))
        window.location.href = "feed.html"

      })

      editBtn.addEventListener("click", () => {
        const updated = prompt("Edit caption:", post.caption || " ")
        if(updated === null) return

        post.caption = updated.trim()
        updatePost(post)

        const captionTextEl = document.querySelector(".caption-text")
        if (captionTextEl) captionTextEl.textContent = post.caption


      })

  });
  menuCloseBtn.addEventListener('click', () => {
      menuBar.classList.remove('display');
      menuCloseBtn.classList.remove('close');
  })

}
else if (post.userId !== currentUser.id) {
  
  menuBtn.style.display = "none";
  menuBar.style.display = "none";
  menuCloseBtn.style.display = "none";
}

})



function timeAgo(isoString) {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now - past;

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr  = Math.floor(min / 60);
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








