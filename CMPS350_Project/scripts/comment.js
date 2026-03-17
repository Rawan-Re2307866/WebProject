
/* Display Comments */

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.comment-here').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.querySelector('#comment');
    const text = input.value.trim();
    
    if (text) {
      const container = document.querySelector('.other-comments');
      const commentDiv = document.createElement('div');
      commentDiv.style.cssText = 'margin: 10px 0; padding: 8px; background: none; font-size: x-small';
      commentDiv.textContent = text;
      
      container.appendChild(commentDiv);
      input.value = '';
    }
  });
});

/* Create Post Page */

const createPostPageBtn = document.querySelector(".create-post-page-btn");
const createPostPage = document.querySelector(".create-post-page");
const closeCreatePageBtn = document.querySelector(".close-create-post-btn");
const postContentBtn = document.querySelector(".post-content-btn")

createPostPageBtn.addEventListener("click", () => createPostPage.classList.add("show"));
closeCreatePageBtn.addEventListener("click", () => createPostPage.classList.remove("show"));

const textPostTypeBtn = document.querySelector(".text-post-type")
const imagePostTypeBtn = document.querySelector(".image-post-type")
const videoPostTypeBtn = document.querySelector(".video-post-type")
const postType = document.querySelector(".text-image-video-content")

const postContent = document.querySelector(".content")
const postCaption = document.querySelector(".caption-text")
const postCaptionText = document.querySelector("#caption-text")
const mediaContent = document.querySelector("#media-content")
const textContent = document.querySelector("#text-content")

let currentType = "text"
let currentMediaFile = null

function clearPreviousSelection() {
  mediaContent.value = ""
  currentMediaFile = null

  textContent.value = ""

  const oldPreview = postType.querySelector("img, video, p.preview-text");
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

videoPostTypeBtn.addEventListener("click", () => 
{
  clearPreviousSelection()

  currentType = "video"

  postType.classList.add("media")
  postType.classList.remove("text")

  mediaContent.accept = "video/*"
  mediaContent.click()
})


mediaContent.addEventListener("change", () => 
{
  const file = mediaContent.files[0]
  
  if (!file) return;

  const oldPreview = postType.querySelector("img, video, p.preview-text")
  if (oldPreview) oldPreview.remove();

  const url = URL.createObjectURL(file)

  if(currentType == "image") {
    const img = document.createElement("img");
    img.src = url
    img.alt = "image preview"
    postType.appendChild(img)
  }
  else if (currentType == "video") {
    const video = document.createElement("video");
    video.src = url
    video.controls = true
    postType.appendChild(video)

  }
})


/* Post */
postContentBtn.addEventListener("click", () => 
{

  const captionText = postCaptionText.value.trim()
  postCaption.textContent = captionText || ""

  postContent.innerHTML = ""

  if (currentType == "text") {
    const text = textContent.value.trim()
    if (!text && !captionText) {
      alert("Write some text or add a caption before posting.")
      return;
    }

    const p = document.createElement("p")
    p.textContent = text || captionText
    postContent.appendChild(p)
  }

  else if (currentType == "image" || currentType == "video") {
    
    const file = mediaContent.files[0]
    if (!file) {
      alert("Please select an image or video file.")
      return
    }

    const url = URL.createObjectURL(file)

    if(currentType == "image") {
      const img = document.createElement("img");
      img.src = url
      img.alt = "post image"
      postContent.appendChild(img)
    }
    else {
      const video = document.createElement("video");
      video.src = url
      video.controls = true
      postContent.appendChild(video)
  
    }

  }

  createPostPage.classList.remove("show")
  postContent.classList.add("post")

})





/* Sample Data */
const posts = 
[
  {
    id: 100,
    userId: 1,
    caption: "" ,
    content: "text/image src/video src",
    createdAt:"",
    likes: [], /* users id's */
    comments: [], /* comments id's */
  }
]

const comments =
[
  {
    id: 1000,
    userId: 1,
    postId:100,
    content: "",
    createdAt:"",
  }
]


