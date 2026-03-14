
const menuBtn = document.querySelector(".menu-btn");
const menuCloseBtn = document.querySelector(".menu-close-btn");
const menuBar = document.querySelector(".menu-bar");
const hideContent = document.querySelector(".hide-content");

menuBtn.addEventListener('click', () => { 
    menuBar.classList.add('display');
    hideContent.classList.add('hide');
});
menuCloseBtn.addEventListener('click', () => {
    menuBar.classList.remove('display');
    hideContent.classList.remove('hide');
});