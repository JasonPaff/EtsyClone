const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('categories', {
        title: 'Etsy Clone', session: req.session, categories: require('../utils/dbUtils').getCategoriesList()
    });
});

router.post('/', function (req, res) {
    getAllCategoryProducts(req, res).catch(console.error);
});

async function getAllCategoryProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllProductsByCategory(req.body.category);
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);
    res.render('products', {title: 'Etsy Clone', session: req.session, products: adjustedProducts});
}

module.exports = router;