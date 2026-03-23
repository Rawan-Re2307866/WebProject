import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"

/* Create Post Page */
const postContentBtn = document.querySelector(".post-content-btn")


/* create-post.html */
const textPostTypeBtn = document.querySelector(".text-post-type")
const imagePostTypeBtn = document.querySelector(".image-post-type")
const postType = document.querySelector(".text-image-content")
const mediaContent = document.querySelector("#media-content")
const textContent = document.querySelector("#text-content")
const postCaptionText = document.querySelector("#caption-text")

let currentType = "text"
let currentMediaFile = null

function clearPreviousSelection() {
  mediaContent.value = ""
  currentMediaFile = null

  textContent.value = ""

  const oldPreview = postType.querySelector("img, p.preview-text");
  if (oldPreview) oldPreview.remove();
}

textPostTypeBtn.addEventListener("click", () => 
{
  clearPreviousSelection()

  currentType = "text"
  currentMediaFile = null

  postType.classList.add("text")
  postType.classList.remove("media")
})

imagePostTypeBtn.addEventListener("click", () => 
{
  clearPreviousSelection()

  currentType = "image"

  postType.classList.add("media")
  postType.classList.remove("text")

  mediaContent.accept = "image/*"
  mediaContent.click()
})


mediaContent.addEventListener("change", () => 
{
  const file = mediaContent.files[0]
  
  if (!file) return;

  const oldPreview = postType.querySelector("img, p.preview-text")
  if (oldPreview) oldPreview.remove();

  const url = URL.createObjectURL(file)

  if(currentType == "image") {
    const img = document.createElement("img");
    img.src = url
    img.alt = "image preview"
    postType.appendChild(img)
  }
})

const currentUser = getCurrentUser()
const username = document.querySelector(".create-post-username")
const userPic = document.querySelector(".user-pic")
username.textContent = currentUser.username
userPic.src = currentUser.profilePicture

/* Post */
postContentBtn.addEventListener("click", () => 
{

  const captionText = postCaptionText.value.trim()
  const newPostId = Date.now()

  const newPost = {
    postId: newPostId,
    userId: currentUser.id,
    caption: captionText ,
    type: currentType,
    content: null,
    createdAt: new Date().toISOString(),
    likes: 0, 
    comments: [], 
  }


  if (currentType == "text") {
    const text = textContent.value.trim()
    if (!text) {
      alert("Write some text")
      return;
    }
    newPost.content = text

    addPost(newPost);
    window.location.href = "feed.html";
  }

  else if (currentType == "image") {
    
    const file = mediaContent.files[0]
    if (!file) {
      alert("Please select an image file.")
      return
    }


    const reader = new FileReader()
    reader.onload = function (e) {
      newPost.content = e.target.result 

      addPost(newPost)
      window.location.href = "feed.html"
    };

    reader.readAsDataURL(file);

  }


 


})