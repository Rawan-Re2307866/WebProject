import {nanoid} from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

document.addEventListener("DOMContentLoaded", function(){
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener('submit',function(e){
        e.preventDefault();
        
        const email=document.getElementById('register-email').value.trim();
        const username= document.getElementById('register-username').value.trim();
        const password= document.getElementById('register-password').value;
        const confirmPassword= document.getElementById('check-password').value;

        const emailError = document.getElementById('register-emailError');
        const usernameError = document.getElementById('register-usernameError');
        const passwordError = document.getElementById('register-passwordError');
        const confirmError = document.getElementById('check-passwordError');

        emailError.textContent = '';
        usernameError.textContent = '';
        passwordError.textContent = '';
        confirmError.textContent = ''; 

        let isValid= true;

        const emailValid= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailValid.test(email)){
            emailError.textContent = "Please enter a valid email address.";
            isValid= false;
        }

        const usernameValid= /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
        if(!usernameValid.test(username)){
            usernameError.textContent = " Username must start with a letter and be between 3-20 characters.";
            isValid = false;
        }

        const passwordValid= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])[a-zA-Z0-9!@#$%^&*()\-.+]{8,30}$/;
        if(!passwordValid.test(password)){
            passwordError.textContent = " Password must be 8+ characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character.";
            isValid = false;
        }

        if (password != confirmPassword){
            confirmError.textContent = "Passwords do not match."
            isValid = false;
        }

        if(isValid){
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const usernameExists = users.find( U => U.username === username);
            if (usernameExists){
                usernameError.textContent = 'Username already taken.'
                return;
            }
            const emailExists = users.find(u=> u.email === email);
            if (emailExists){
                emailError.textContent = 'Email already registered.'
                return;
            }
            const newUser = {
                id: nanoid(),
                username: username,
                email: email,
                password: password,
                bio:'',
                profilePicture: 'images/prof1.png',
                followers: [],
                following:[],
                posts:[],
                comments:[],
                createAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration complete, please log in.')

            window.location.href= 'login.html';
        }


    })
})