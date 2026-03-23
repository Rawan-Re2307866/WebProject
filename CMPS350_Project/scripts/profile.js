import {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment} from "./storage.js"


document.addEventListener('DOMContentLoaded', function(){
    const currentUser = getCurrentUser()

    if (!currentUser){
        window.location.href= 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const viewingUserId = urlParams.get('userId');

    let profileUser;

    if(viewingUserId){
        const users = JSON.parse(localStorage.getItem('users')) || [];
        profileUser = users.find( u => u.id === viewingUserId);

        if (!profileUser){
            alert('User not found');
            window.location.href= 'feed.html';
            return;
        }
    } else{
        profileUser = currentUser;
    }
    displayProfile(profileUser, currentUser);
});

function displayProfile(profileUser, currentUser){

    document.querySelector(".profile-username").textContent = profileUser.username;

    document.querySelector(".bio").textContent= profileUser.bio || 'No bio yet.';

    document.querySelector(".profile-img").src = profileUser.profilePicture;

    const allPosts= getPosts();
    const userPosts= allPosts.filter(p => p.userId === profileUser.id);

    document.querySelector('.posts-number .count').textContent = userPosts.length;
    document.querySelector('.followers .count').textContent = profileUser.following.length;
    document.querySelector('.following .count').textContent = profileUser.following.length;

    const actionButton = document.querySelector('.edit-btn');

    if (profileUser.id === currentUser.id){
        actionButton.textContent = 'Edit Profile';
        actionButton.onclick = function () {
    window.location.href = 'edit.html';
};
    } else{
        const isFollowing = currentUser.following.includes(profileUser.id);
        actionButton.textContent = isFollowing ? 'Unfollow' : 'Follow';
        actionButton.onclick = function(){
            toggleFollow(profileUser.id, currentUser);
        };
    }
    //displayUserPosts(userPosts);

}

function toggleFollow(userId, currentUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    
    const currentUserIndex = users.findIndex(u => u.id === currentUser.id);
    const targetUserIndex = users.findIndex(u => u.id === userId);
    
    if (currentUserIndex === -1 || targetUserIndex === -1) return;
    
    const isFollowing = users[currentUserIndex].following.includes(userId);
    
    if (isFollowing) {
        
        users[currentUserIndex].following = users[currentUserIndex].following.filter(id => id !== userId);
        users[targetUserIndex].followers = users[targetUserIndex].followers.filter(id => id !== currentUser.id);
    } else {
    
        users[currentUserIndex].following.push(userId);
        users[targetUserIndex].followers.push(currentUser.id);
    }
    
    
    localStorage.setItem('users', JSON.stringify(users));
    
    
    localStorage.setItem('currentUser', JSON.stringify(users[currentUserIndex]));
    
    
    location.reload();
}

function displayUserPosts(posts) {
    const postsContainer = document.querySelector('.posts');
    postsContainer.innerHTML = ''; 
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No posts yet</p>';
        return;
    }
    
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-profile';
        
    
        if (post.type === 'image') {
            const img = document.createElement('img');
            img.src = post.content;
            img.alt = 'Post';
            postDiv.appendChild(img);
        } 
        else if (post.type === "video") {
            const video = document.createElement("video");
            video.src = post.content;
            video.muted = true;
            video.playsInline = true;
            postDiv.appendChild(video);
          } 
          else if (post.type === "text") {
            const textDiv = document.createElement("div");
            textDiv.textContent = post.content;
            textDiv.style.display = "flex";
            textDiv.style.alignItems = "center";
            textDiv.style.justifyContent = "center";
            textDiv.style.padding = "4px";
            postDiv.appendChild(textDiv);

            
            /*postDiv.innerHTML = `<p style="padding: 1rem; font-size: 0.9rem; overflow: hidden;">${post.content.substring(0, 50)}...</p>`;*/
        }
        
    
        postDiv.onclick = function() {
            window.location.href = `post.html?postId=${post.postId}`;
        };
        postDiv.style.cursor = 'pointer';
        
        postsContainer.appendChild(postDiv);
    });
}