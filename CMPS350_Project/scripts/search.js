document.addEventListener('DOMContentLoaded', function () {
    const searchInput   = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const currentUser   = JSON.parse(localStorage.getItem('currentUser'));

    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!query) {
            searchResults.classList.remove('open');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const matches = users.filter(u =>
            u.username.toLowerCase().includes(query) &&
            u.id !== currentUser.id
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<p style="padding:0.7rem 1rem; color:#999; font-size:0.85rem;">No users found</p>';
            searchResults.classList.add('open');
            return;
        }

        matches.forEach(user => {
            const a = document.createElement('a');
            a.className = 'search-result-item';
            a.href = `profile.html?userId=${user.id}`;
            a.innerHTML = `
                <img src="${user.profilePicture || 'images/prof1.png'}" alt="${user.username}">
                <span>${user.username}</span>
            `;
            searchResults.appendChild(a);
        });

        searchResults.classList.add('open');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('open');
            searchInput.value = '';
        }
    });
});