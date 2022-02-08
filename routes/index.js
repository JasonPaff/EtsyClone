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
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    res.render('index', {
        title: 'Etsy Clone',
        session: req.session,
        products: adjustedProducts
    });
}

module.exports = router;