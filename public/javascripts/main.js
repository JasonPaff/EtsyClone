// Burger menus
document.addEventListener('DOMContentLoaded', function() {
    // open
    const burger = document.querySelectorAll('.navbar-burger');
    const menu = document.querySelectorAll('.navbar-menu');

    if (burger.length && menu.length) {
        for (let i = 0; i < burger.length; i++) {
            burger[i].addEventListener('click', function() {
                for (let j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    // close
    const close = document.querySelectorAll('.navbar-close');
    const backdrop = document.querySelectorAll('.navbar-backdrop');

    if (close.length) {
        for (let i = 0; i < close.length; i++) {
            close[i].addEventListener('click', function() {
                for (let j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    if (backdrop.length) {
        for (let i = 0; i < backdrop.length; i++) {
            backdrop[i].addEventListener('click', function() {
                for (let j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }
});

let loginForm = document.getElementById('login');
let registerForm = document.getElementById('register');
let toggleButton = document.getElementById('btn');

function register(){
    loginForm.style.display = 'none';
    loginForm.style.left="-400px";
    registerForm.style.display = 'block';
    registerForm.style.left="50px";
    toggleButton.style.left="110px";
}
function login(){
    loginForm.style.display = 'block';
    loginForm.style.left="50px";
    registerForm.style.display = 'none';
    registerForm.style.left="450px";
    toggleButton.style.left="0px";
}