const express = require("express");
const router = express.Router();


router.get('/', function (req, res) {
    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProducts();
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    res.render('products', { title: 'Etsy Clone', cartCount: req.session.cartCount, loggedIn: req.session.loggedIn, products: adjustedProducts });
}

module.exports = router;