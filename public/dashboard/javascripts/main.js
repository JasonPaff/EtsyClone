// BURGER MENU
document.addEventListener('DOMContentLoaded', function () {
    // open
    const burger = document.querySelectorAll('.navbar-burger');
    const menu = document.querySelectorAll('.navbar-menu');

    if (burger.length && menu.length) {
        for (let i = 0; i < burger.length; i++) {
            burger[i].addEventListener('click', function () {
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
            close[i].addEventListener('click', function () {
                for (let j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }

    if (backdrop.length) {
        for (let i = 0; i < backdrop.length; i++) {
            backdrop[i].addEventListener('click', function () {
                for (let j = 0; j < menu.length; j++) {
                    menu[j].classList.toggle('hidden');
                }
            });
        }
    }
});

// add to cart alert
function productAddedToCartAlert(name) {
    let addedDiv = document.createElement("div");
    let productWin = document.getElementById(name);
    addedDiv.innerHTML = "Added to Cart";
    setTimeout(function () {
        productWin.removeChild(addedDiv);
    }, 1000);
    productWin.appendChild(addedDiv);
}

// add to cart alert
function productAddedToWishlistAlert(name) {
    let addedDiv = document.createElement("div");
    let productWin = document.getElementById(name);
    addedDiv.innerHTML = "Added to Wishlist";
    setTimeout(function () {
        productWin.removeChild(addedDiv);
    }, 1000);
    productWin.appendChild(addedDiv);
}

// not logged in add to cart alert
function noProductAddedToCartAlert(name) {
    let addedDiv = document.createElement("div");
    let productWin = document.getElementById(name);
    addedDiv.innerHTML = "Login/Register to use the cart";
    setTimeout(function () {
        productWin.removeChild(addedDiv);
    }, 1000);
    productWin.appendChild(addedDiv);
}

// redirect to user store
function storeRedirect(id) {
    document.getElementById('storeId').value = id;
    document.getElementById("storeRedirect").submit();
}

// submit search bar enter key press
document.getElementById('searchBar')
    .addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            document.querySelector('searchBar').requestSubmit();
        }
    });

const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);