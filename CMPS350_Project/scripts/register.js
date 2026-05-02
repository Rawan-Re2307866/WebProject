import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
import { getUsers, addUser } from "./storage.js";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('check-password').value;

        const emailError = document.getElementById('register-emailError');
        const usernameError = document.getElementById('register-usernameError');
        const passwordError = document.getElementById('register-passwordError');
        const confirmError = document.getElementById('check-passwordError');

        emailError.textContent = '';
        usernameError.textContent = '';
        passwordError.textContent = '';
        confirmError.textContent = '';

        let isValid = true;

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValid.test(email)) {
            emailError.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        const usernameValid = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
        if (!usernameValid.test(username)) {
            usernameError.textContent = " Username must start with a letter and be between 3-20 characters.";
            isValid = false;
        }

        const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])[a-zA-Z0-9!@#$%^&*()\-.+]{8,30}$/;
        if (!passwordValid.test(password)) {
            passwordError.textContent = " Password must be 8+ characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character.";
            isValid = false;
        }

        if (password != confirmPassword) {
            confirmError.textContent = "Passwords do not match."
            isValid = false;
        }

        if (isValid) {
            const users = getUsers();

            const usernameExists = users.find(U => U.username === username);
            if (usernameExists) {
                usernameError.textContent = 'Username already taken.'
                return;
            }
            const emailExists = users.find(u => u.email === email);
            if (emailExists) {
                emailError.textContent = 'Email already registered.'
                return;
            }
            const newUser = {
                id: nanoid(),
                username: username,
                email: email,
                password: password,
                bio: '',
                profilePicture: 'images/prof1.png',
                followers: [],
                following: [],
                posts: [],
                comments: [],
                createAt: new Date().toISOString()
            };
            addUser(newUser);
            alert('Registration complete, please log in.')

            window.location.href = 'login.html';
        }


    })

    //  register password
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const registerPasswordInput = document.getElementById('register-password');
    const registerEyeIcon = toggleRegisterPassword.querySelector('.eye-icon');
    const registerEyeSlashIcon = toggleRegisterPassword.querySelector('.eye-slash-icon');

    toggleRegisterPassword.addEventListener('click', function (e) {
        e.preventDefault();
        const type = registerPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        registerPasswordInput.setAttribute('type', type);

        if (type === 'text') {
            registerEyeIcon.classList.add('hidden');
            registerEyeSlashIcon.classList.remove('hidden');
        } else {
            registerEyeIcon.classList.remove('hidden');
            registerEyeSlashIcon.classList.add('hidden');
        }
    });

    // confirm password
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('check-password');
    const confirmEyeIcon = toggleConfirmPassword.querySelector('.eye-icon');
    const confirmEyeSlashIcon = toggleConfirmPassword.querySelector('.eye-slash-icon');

    toggleConfirmPassword.addEventListener('click', function (e) {
        e.preventDefault();
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);

        if (type === 'text') {
            confirmEyeIcon.classList.add('hidden');
            confirmEyeSlashIcon.classList.remove('hidden');
        } else {
            confirmEyeIcon.classList.remove('hidden');
            confirmEyeSlashIcon.classList.add('hidden');
        }
    });
})