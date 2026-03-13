
const menuBtn = document.querySelector(".menu-btn");
const menuCloseBtn = document.querySelector(".menu-close-btn");
const menuBar = document.querySelector(".menu-bar");

menuBtn.addEventListener('click', () => menuBar.classList.add('display'));
menuCloseBtn.addEventListener('click', () => menuBar.classList.remove('display'));