import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"

document.addEventListener("DOMContentLoaded", () => 
{
    const currentUser = getCurrentUser()
    const posts = getPosts()

    const userPosts = posts.filter( (post) => post.userId === currentUser.id)\

    const postSection = document.querySelector(".posts")
    postSection.innerHTML = " "
    
    if (userPosts.length === 0) {
        postsSection.innerHTML =
      '<p style="text-align:center; color:#999; padding:1rem;">No posts yet.</p>';
    return
    }

    userPosts.forEach( (post) => {
        const divItem = document.createElement("div")
        divItem.classList.add("post-profile")

        const link = document.createElement("a")
        link.href = `post.html?postId=${post.postId}`

        if (post.type === "image") {
            const img = document.createElement("img");
            img.src = post.content;
            img.alt = "Post";
            link.appendChild(img);
          } else if (post.type === "video") {
            const video = document.createElement("video");
            video.src = post.content;
            video.muted = true;
            video.playsInline = true;
            link.appendChild(video);
          } else if (post.type === "text") {
            const textDiv = document.createElement("div");
            textDiv.textContent = post.content;
            textDiv.style.display = "flex";
            textDiv.style.alignItems = "center";
            textDiv.style.justifyContent = "center";
            textDiv.style.padding = "4px";
            link.appendChild(textDiv);
          }
      
          item.appendChild(link);
          postsSection.appendChild(item);
    })

    const postsCount = document.querySelector(".posts-number .count");
    if (postsCountSpan) {
      postsCount.textContent = userPosts.length;
    }

})
