const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    getCart(req, res).catch(console.error);
});

router.post('/addToCart', function (req, res) {
    addToCart(req).catch(console.error);
});

router.post('/removeFromCart', function (req, res) {
    removeFromCart(req, res).catch(console.error);
});

// adds an items to the cart
async function addToCart(req) {
    if (req.session.loggedIn) {
        await require('../utils/dbUtils').addProductToCart(req.body.productId, 1, req.session.user)
        req.session.cartCount = await require('../utils/dbUtils').getCartCount(req.session.user);
    }
}

// removes an item from the cart
async function removeFromCart(req, res) {
    if (req.session.loggedIn) {
        await require('../utils/dbUtils').removeProductFromCart(req.body.productId, req.session.user);
        req.session.cartCount = await require('../utils/dbUtils').getCartCount(req.session.user);
        getCart(req, res).catch(console.error);
    }
}

// renders the cart contents to the cart page
async function getCart(req, res) {
    let products = null;
    let adjustedProducts = null;

    if (req.session.loggedIn) {
        const cart = await require('../utils/dbUtils').getUserCart(req.session.user);
        adjustedProducts = await require('../utils/dbUtils').getAllCartProducts(cart);
        products = require('../utils/dbUtils').calculateSalePrices(adjustedProducts);
    }

    let subTotal = 0;

    if (products !== null) {
        products.forEach(product => {
            subTotal += parseFloat(product.dataValues.price);
        });
    }

    const storeNames = await require('../utils/dbUtils').getStoreNamesFromProducts(products);

    for (let c = 0; c < products.length; c++) {
        products[c].dataValues.storeName = storeNames[c];
    }

    console.log(products[0]);

    const tax = subTotal * 0.05;
    const total = subTotal + tax;
    let canCheckout = false;
    if (subTotal > 0) canCheckout = true;

    res.render('cart', {
        title: 'Cart',
        session: req.session,
        products: products,
        subTotal: subTotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        canCheckout: canCheckout
    });
}

module.exports = router;