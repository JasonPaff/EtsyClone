const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    // create no account cart if not created
    if (!req.session.cart) req.session.cart = {
        product_id: [], quantity: []
    };

    // create cart count if not created
    if (!req.session.cartCount) req.session.cartCount = 0;

    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProducts();
    const priceAdjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    const colorSizeAdjustedProducts = require('../utils/dbUtils').addSizeColorFlags(priceAdjustedProducts);
    const sortedProducts = require('../utils/dbUtils').sortProductsByViewCount(colorSizeAdjustedProducts);

    res.render('index', {
        title: 'Etsy Clone',
        session: req.session,
        products: sortedProducts
    });
}

module.exports = router;