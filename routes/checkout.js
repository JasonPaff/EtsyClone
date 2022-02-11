const express = require("express");
const router = express.Router();
const stripe = require('stripe')('sk_test_51KRQvQHL4ylhr8vWV0iiirvTqtsqOqpZ98U4uc9XBDx4kpCbGYUHdewJCyUUwfYylrjAX5PUBHxsU9f9A58Saka200yO9DutSZ');

router.get('/', function (req, res) {
    getCart(req, res).catch(console.error);
});

router.post('/removeFromCart', function (req, res) {
    removeFromCart(req, res).catch(console.error);
});

router.get('/stripe', function (req, res) {
    checkout(req, res).catch(console.error);
});

// process stripe checkout
async function checkout(req, res) {
    const lineItems = await createLineItems(req.session.user);

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://our-etsy.herokuapp.com/summary',
        cancel_url: 'https://our-etsy.herokuapp.com/checkout',
    });

    res.redirect(303, session.url);
}

// create line items for stripe checkout
async function createLineItems(user) {
    let products = null;

    const cart = await require('../utils/dbUtils').getUserCart(user);
    products = await require('../utils/dbUtils').getAllCartProducts(cart);

    let lineItems = [];

    if (products !== null) {
        products.forEach(product => {
            lineItems.push({
                price_data: {
                    currency: 'usd', product_data: {
                        name: product.name,
                    }, unit_amount_decimal: (product.price * 100).toFixed(8),
                }, quantity: 1,
            });
        });
    }

    return lineItems;
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

        const cart = await require('../utils/dbUtils').getUserCart(req.session.user);
        products = await require('../utils/dbUtils').getAllCartProducts(cart);

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

        const tax = subTotal * 0.05;
        const total = subTotal + tax;

        res.render('checkout', {
            title: 'Checkout',
            session: req.session,
            shipping: 3,
            products: products,
            subTotal: subTotal.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2),
        });
    }

    module.exports = router;