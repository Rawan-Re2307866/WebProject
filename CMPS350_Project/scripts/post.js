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

const profilePic = document.querySelector(".profile-pic");
const username = document.querySelector(".username");
const content = document.querySelector(".content");
const likeBtn = document.querySelector(".like-btn");
const likeCount = document.querySelector(".like-count");
const captionUser = document.querySelector(".caption-user");
const captionText = document.querySelector(".caption-text");

username.textContent = poster.username
profilePic.src = poster.profilePicture

if (post.type === "text") {
  content.innerHTML = `<p>${post.content}</p>`
}
else if (post.type === "image") {
  content.innerHTML = `<img src="${post.content}" alt="Post image">`
}

likeCount.textContent = post.likes ?? 0;
captionUser.textContent = poster ? poster.username : "";
captionText.textContent = post.caption || "";

likeBtn.addEventListener("click", () => {
  likeBtn.classList.toggle("liked");
  let count = parseInt(likeCount.textContent, 10);
  count = likeBtn.classList.contains("liked") ? count + 1 : count - 1;
  likeCount.textContent = count;
  post.likes = count;
  updatePost(post);
});

content.classList.add("post")


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
  divItem.style.cssText = "margin: 10px 0; padding: 8px; background: none; font-size: x-small;"

  divItem.innerHTML = `
    <strong>${comment.username}</strong>
    <span style="margin-left: 4px;">${comment.content}</span>
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





