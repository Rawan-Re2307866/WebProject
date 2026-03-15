/* users, posts, and comments */


/* users */
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function addUser(user) {
    localStorage.setItem("users",JSON.stringify(user));
}

/* posts */
function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}

function addPost(post) {
    localStorage.setItem("posts", JSON.stringify(post));
}

/* comments */
function getComments() {
    return JSON.parse(localStorage.getItem("comments")) || [];
}

function addComment(comment) {
    localStorage.setItem("comments", JSON.stringify(comment));
}

