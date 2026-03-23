/* Create Post Page */
const postContentBtn = document.querySelector(".post-content-btn")


/* create-post.html */
const textPostTypeBtn = document.querySelector(".text-post-type")
const imagePostTypeBtn = document.querySelector(".image-post-type")
const videoPostTypeBtn = document.querySelector(".video-post-type")
const postType = document.querySelector(".text-image-video-content")
const mediaContent = document.querySelector("#media-content")
const textContent = document.querySelector("#text-content")
const postCaptionText = document.querySelector("#caption-text")

/* post.html */
const postContent = document.querySelector(".content")
const postCaption = document.querySelector(".caption-text")

/* feed.html */
const postContentfeed = document.querySelector(".post-content")


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
    if (!text) {
      alert("Write some text")
      return;
    }

    const p = document.createElement("p")
    p.textContent = text 
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