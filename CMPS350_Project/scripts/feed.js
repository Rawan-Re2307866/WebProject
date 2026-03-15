document.addEventListener("DOMContentLoaded", () => {

    const likeButtons = document.querySelectorAll(".like-btn");

    likeButtons.forEach(button => {
        const likeCount = button.nextElementSibling;
        button.addEventListener("click", () => {
            button.classList.toggle("liked");
            let count = parseInt(likeCount.textContent);
            if (button.classList.contains("liked")) {
                likeCount.textContent = count + 1;
            } else {
                likeCount.textContent = count - 1;
            }
        });
    });
});