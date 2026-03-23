// Edit Profile Page

document.addEventListener('DOMContentLoaded', function () {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Elements
    const previewImg        = document.getElementById('preview-img');
    const avatarInput       = document.getElementById('avatar-input');
    const avatarWrapper     = document.getElementById('avatar-wrapper');

    const usernameInput     = document.getElementById('edit-username');
    const bioInput          = document.getElementById('edit-bio');

    const currentPwInput    = document.getElementById('current-password');
    const newPwInput        = document.getElementById('new-password');
    const confirmPwInput    = document.getElementById('confirm-new-password');

    const usernameError     = document.getElementById('username-error');
    const currentPwError    = document.getElementById('current-password-error');
    const newPwError        = document.getElementById('new-password-error');
    const confirmPwError    = document.getElementById('confirm-password-error');

    const passwordToggle    = document.getElementById('password-toggle');
    const passwordFields    = document.getElementById('password-fields');

    const saveBtn           = document.getElementById('save-btn');
    const toast             = document.getElementById('toast');

    // Pre fill current values
    usernameInput.value = currentUser.username || '';
    bioInput.value      = currentUser.bio || '';
    previewImg.src      = currentUser.profilePicture || 'images/prof1.png';

    // Avatar preview
    let newAvatarDataUrl = null;

    avatarWrapper.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            newAvatarDataUrl = e.target.result;
            previewImg.src   = newAvatarDataUrl;
        };
        reader.readAsDataURL(file);
    });

    // Password section toggle
    passwordToggle.addEventListener('click', function () {
        const isOpen = passwordFields.classList.toggle('visible');
        passwordToggle.classList.toggle('open', isOpen);
    });
 // Helpers
    function clearErrors() {
        usernameError.textContent   = '';
        currentPwError.textContent  = '';
        newPwError.textContent      = '';
        confirmPwError.textContent  = '';
    }

    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // Save
    saveBtn.addEventListener('click', function () {
        clearErrors();

        const newUsername = usernameInput.value.trim();
        const newBio      = bioInput.value.trim();
        const isChangingPassword = passwordFields.classList.contains('visible');

        let isValid = true;

        // Validate username
        const usernameValid = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
        if (!usernameValid.test(newUsername)) {
            usernameError.textContent = 'Username must start with a letter and be 3–20 characters.';
            isValid = false;
        }

        // Check username taken by another user
        if (isValid && newUsername !== currentUser.username) {
            const users = getUsers();
            const taken = users.find(u => u.username === newUsername && u.id !== currentUser.id);
            if (taken) {
                usernameError.textContent = 'Username already taken.';
                isValid = false;
            }
        }

        // Validate password fields if the section is open
        let newPasswordValue = null;
        if (isChangingPassword) {
            const currentPw  = currentPwInput.value;
            const newPw      = newPwInput.value;
            const confirmPw  = confirmPwInput.value;

            if (currentPw !== currentUser.password) {
                currentPwError.textContent = 'Current password is incorrect.';
                isValid = false;
            }

            const passwordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.])[a-zA-Z0-9!@#$%^&*()\-.+]{8,30}$/;
            if (!passwordValid.test(newPw)) {
                newPwError.textContent = 'Password must be 8+ characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character.';
                isValid = false;
            }

            if (newPw !== confirmPw) {
                confirmPwError.textContent = 'Passwords do not match.';
                isValid = false;
            }

            if (isValid) newPasswordValue = newPw;
        }

        if (!isValid) return;

        // Apply changes
        const users = getUsers();
        const idx   = users.findIndex(u => u.id === currentUser.id);
        if (idx === -1) return;

        users[idx].username = newUsername;
        users[idx].bio      = newBio;

        if (newAvatarDataUrl) {
            users[idx].profilePicture = newAvatarDataUrl;
        }

        if (newPasswordValue) {
            users[idx].password = newPasswordValue;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[idx]));

        showToast('Profile updated!');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    });

})