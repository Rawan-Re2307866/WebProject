import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"




document.addEventListener("DOMContentLoaded" , () => 
{
    const currentUser = getCurrentUser();
    const posts = getPosts();
    const users = getUsers();

    const postContainer = document.querySelector(".post-container");
    const postTemplate = document.querySelector(".post");

  
    postContainer.innerHTML = "";

    const followingPosts = posts.filter((post) => currentUser.following.includes(post.userId))
    const userPosts = posts.filter( (post) => post.userId === currentUser.id)

    const allFeedPosts = [...userPosts, ...followingPosts];

    if (allFeedPosts.length == 0 ) {
        postContainer.innerHTML = 
        '<p style="text-align: center; color: #999; padding: 2rem;">No posts yet.</p>'
        return
    }

    
    allFeedPosts.forEach( (post) => {
        const poster = users.find( (user) => user.id === post.userId )
        if (!poster) return

        const article = postTemplate.cloneNode(true)
        article.id = " "
        article.classList.remove('postTemplate')
        article.style.display = " "

        const postContent = article.querySelector(".post-content")
        const username = article.querySelector(".username")
        const profilePic = article.querySelector(".profile-pic")
        const captionText = article.querySelector(".caption-text")
        const likes = article.querySelector(".like-count")
        const captionUser = article.querySelector(".caption-user")
        const commentBtn = article.querySelector(".comment-btn")
        const likeBtn = article.querySelector(".like-btn")

        /* user info */
        if (poster.profilePicture) profilePic.src = poster.profilePicture
        
        username.textContent = poster.username

        /* post content */
        if (post.type === "image") {
            postContent.innerHTML = `<img src="${post.content}" alt="Post image">`
        }

        else if (post.type === "video") {
            postContent.innerHTML = `<video src="${post.content}" controls></video>`
        }

        else if (post.type === "text") {
            postContent.innerHTML = `<p>${post.content}</p>`
        }

        /* post likes */
        likeBtn.dataset.postId = post.postId
        likes.textContent = post.likes

        /* post caption */
        captionUser.textContent = poster.username
        captionText.textContent = post.caption 

        /* comments */
        commentBtn.href = `post.html?postId=${post.postId}`

        postContent.classList.add("post")
        postContainer.appendChild(article)


    })

    attachLikeListeners()


})

function attachLikeListeners() {
    const likeBtns = document.querySelectorAll(".like-btn")

    likeBtns.forEach( (btn) => {
        const likeCount = btn.nextElementSibling
        const postId = parseInt(btn.dataset.postId, 10)

        btn.addEventListener("click", () => {
            btn.classList.toggle("liked")

            let count = parseInt(likeCount.textContent, 10)
            count = btn.classList.contains('liked') ? count + 1 : count - 1
            likeCount.textContent = count
            
            const post = posts.find((p) => p.postId === postId)
            if (post) {
                post.likes = count
                updatePost(post)
            }

        })
    })
}






