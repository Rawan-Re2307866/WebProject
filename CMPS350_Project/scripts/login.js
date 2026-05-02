document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');

        usernameError.textContent = '';
        passwordError.textContent = '';

        let isValid = true;
        const usernameValid = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
        if (!usernameValid.test(username)) {
            usernameError.textContent = "Username must start with a letter and be between 3-20 characters only."
            isValid = false;
        }

        const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])[a-zA-Z0-9!@#$%^&*()\-.+]{8,30}$/
        if (!passwordValid.test(password)) {
            passwordError.textContent = "Password must be 8+ characters, 1 uppercase, 1 lowercase,1 digit, 1 special char."
            isValid = false;
        }
        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const user = users.find(U => U.username === username
                && U.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = "feed.html";
            } else {
                alert('Invalid username or password');
            }
        }
    })

    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    const eyeSlashIcon = togglePassword.querySelector('.eye-slash-icon');

    togglePassword.addEventListener('click', function (e) {
        e.preventDefault();
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle icon visibility
        if (type === 'text') {
            eyeIcon.classList.add('hidden');
            eyeSlashIcon.classList.remove('hidden');
        } else {
            eyeIcon.classList.remove('hidden');
            eyeSlashIcon.classList.add('hidden');
        }
    });
})