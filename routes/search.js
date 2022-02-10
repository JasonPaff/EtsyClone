const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    searchProducts(req, res).catch(console.error);
});

async function searchProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProductsByKeyword(req.body.searchBar);
    const priceAdjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    const adjustedProducts = require('../utils/dbUtils').addSizeColorFlags(priceAdjustedProducts);
    res.render('products', { title: 'Etsy Clone', session: req.session, products: adjustedProducts });
}

module.exports = router;