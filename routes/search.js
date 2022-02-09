const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    searchProducts(req, res).catch(console.error);
    //res.render('search', {title: 'Etsy Clone', session: req.session });
});

async function searchProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProductsByKeyword(req.body.searchBar);
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    res.render('products', { title: 'Etsy Clone', session: req.session, products: adjustedProducts });
}

module.exports = router;