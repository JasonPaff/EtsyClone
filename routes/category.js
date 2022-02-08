const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    getAllCategoryProducts(req, res).catch(console.error);
});

async function getAllCategoryProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProductsByCategory(req.body.category);
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    res.render('products', {title: 'Etsy Clone', cartCount: req.session.cartCount, loggedIn: req.session.loggedIn, products: adjustedProducts});
}

module.exports = router;