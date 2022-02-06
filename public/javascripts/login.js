let loginForm = document.getElementById('login');
let registerForm = document.getElementById('register');
let toggleButton = document.getElementById('btn');

// show register form
function register(){
    loginForm.style.display = 'none';
    loginForm.style.left="-400px";
    registerForm.style.display = 'block';
    registerForm.style.left="50px";
    toggleButton.style.left="110px";
}

// show login form
function login(){
    loginForm.style.display = 'block';
    loginForm.style.left="50px";
    registerForm.style.display = 'none';
    registerForm.style.left="450px";
    toggleButton.style.left="0px";
}