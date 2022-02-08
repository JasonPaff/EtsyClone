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
})

async function addToCart(req) {
    if (req.session.loggedIn) {
        req.session.cartCount = req.session.cartCount + 1;
        console.log('cart count: ' + req.session.cartCount);
        await require('../utils/dbUtils').addProductToCart(req.body.productId, 1, req.session.user)
    }
}

async function removeFromCart(req, res) {
    if (req.session.loggedIn) {
        await require('../utils/dbUtils').removeProductFromCart(req.body.productId, req.session.user);
        getCart(req, res);
    }
}

async function getCart(req, res) {
    let products = null;

    if (req.session.loggedIn) {
        const cart = await require('../utils/dbUtils').getUserCart(req.session.user);
        products = await require('../utils/dbUtils').getAllCartProducts(cart);
    }

    let subTotal = 0;
    let shipping = 0;

    if (products !== null) {
        products.forEach(product => {
            subTotal += parseFloat(product.dataValues.price);
        });
        shipping += products.length * 2;
    }

    const tax = subTotal * 0.05;
    const total = subTotal + tax + shipping;
    let canCheckout = false;
    if (subTotal > 0) canCheckout = true;

    res.render('cart', {
        title: 'Cart',
        loggedIn: req.session.loggedIn,
        products: products,
        subTotal: subTotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        canCheckout: canCheckout
    });
}

module.exports = router;