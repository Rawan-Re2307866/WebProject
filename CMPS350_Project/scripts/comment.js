import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"



/* Display Comments */
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const postIdParam = params.get("postId");
  if (!postIdParam) return; 
  const postId = parseInt(postIdParam, 10);
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
})








/* Sample Data */


const comment =
[
  {
    id: 1000,
    userId: 1,
    postId:100,
    content: "",
    createdAt:"",
  }
]


