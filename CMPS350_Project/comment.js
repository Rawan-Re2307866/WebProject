document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('comment-here').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const input = document.getElementById('comment');
    const text = input.value.trim();
    
    if (text) {
      const container = document.getElementById('comments');
      const commentDiv = document.createElement('div');
      commentDiv.style.cssText = 'margin: 10px 0; padding: 8px; background: #f0f0f0; font-size: x-small';
      commentDiv.textContent = text;
      
      container.appendChild(commentDiv);
      input.value = '';
    }
  });
});