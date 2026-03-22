
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


