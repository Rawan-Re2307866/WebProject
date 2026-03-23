import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"

document.addEventListener("DOMContentLoaded", () => 
{
    const currentUser = getCurrentUser()
    const posts = getPosts()

    const userPosts = posts.filter( (post) => post.userId === currentUser.id)
    const postSection = document.querySelector(".posts")
    postSection.innerHTML = " "
    
    if (userPosts.length === 0) {
        postSection.innerHTML =
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
          }
        else if (post.type === "text") {
            const textDiv = document.createElement("div");
            textDiv.textContent = post.content;
            textDiv.style.display = "flex";
            textDiv.style.alignItems = "center";
            textDiv.style.justifyContent = "center";
            textDiv.style.padding = "4px";
            link.appendChild(textDiv);
          }
      
          divItem.appendChild(link);
          postSection.appendChild(divItem);
    })

    const postsCount = document.querySelector(".posts-number .count");
    if (postsCount) {
      postsCount.textContent = userPosts.length;
    }

})
