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
})