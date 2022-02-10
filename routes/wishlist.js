const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    getWishlist(req, res).catch(console.error);
});

router.post('/addToWishlist', function (req, res) {
    addToWishlist(req).catch(console.error);
})

router.post('/removeFromWishlist', function (req, res) {
    removeFromWishlist(req, res).catch(console.error);
})

// adds an items to the wishlist
async function addToWishlist(req) {
    if (req.session.loggedIn) {
        await require('../utils/dbUtils').addProductToWishlist(req.body.productId, 1, req.session.user)
    }
}

// removes an item from the cart
async function removeFromWishlist(req, res) {
    if (req.session.loggedIn) {
        await require('../utils/dbUtils').removeProductFromWishlist(req.body.productId, req.session.user);
    }
    getWishlist(req, res).catch(console.error);
}

async function getWishlist(req, res) {
    let products = null;
    let adjustedProducts = null;

    if (req.session.loggedIn) {
        const cart = await require('../utils/dbUtils').getUserWishlist(req.session.user);
        adjustedProducts = await require('../utils/dbUtils').getAllWishlistProducts(cart);
        products = require('../utils/dbUtils').calculateSalePrices(adjustedProducts);
    }

    const storeNames = await require('../utils/dbUtils').getStoreNamesFromProducts(products);

    for (let c = 0; c < products.length; c++) {
        products[c].dataValues.storeName = storeNames[c];
    }

    res.render('wishlist', {title: 'Etsy Clone', session: req.session, products: products});
}

module.exports = router;