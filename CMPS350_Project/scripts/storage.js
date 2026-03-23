/* users, posts, and comments */

/* users */
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function addUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

function updateUser(updatedUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"))
}

/* posts */
function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function addPost(post) {
    const posts = getPosts();
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

function updatePost(updatedPost) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
        posts[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(posts));
    }
}

function getCurrentPostId() {
    return JSON.parse(locslStorage.getItem("currentPostId"))
}

function setCurrentPostId(id) {
    localStorage.setItem("currentPostId", JSON.stringify(id))
}

/* comments */
function getComments() {
    return JSON.parse(localStorage.getItem("comments")) || [];
}

function addComment(comment) {
    const comments = getComments();
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
}

function updateComment(updatedComment) {
    const comments = getComments();
    const index = comments.findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
        comments[index] = updatedComment;
        localStorage.setItem("comments", JSON.stringify(comments));
    }
}



export {getUsers,addUser,updateUser,getCurrentUser,getPosts,updatePost,getCurrentPostId,setCurrentPostId,addPost,getComments,addComment,updateComment}