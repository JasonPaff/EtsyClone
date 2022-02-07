let loginForm = document.getElementById('login');
let registerForm = document.getElementById('register');
let toggleButton = document.getElementById('btn');

registerForm.onsubmit = validatePasswordMatch;

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

// ensure passwords match when registering account
function validatePasswordMatch(){
    const repeatPassword = document.getElementById('repeatPassword').value;
    const password = document.getElementById('password').value;

    return repeatPassword === password
}