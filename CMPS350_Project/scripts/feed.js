document.addEventListener("DOMContentLoaded", () => {
    console.log("feed.js is connected");

    const likeButtons = document.querySelectorAll(".like-btn");
    console.log("found like buttons:", likeButtons.length);

    likeButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("liked");
        });
    });
});