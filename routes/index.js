const express = require("express");
const models = require("../models");
const router = express.Router();

router.get('/', function (req, res) {
    // create cart count if not created
    if(!req.session.cartCount) req.session.cartCount = 0;

    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    const products = await models.Product.findAll({});

    // create sale percents and flag anything that is on sale
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);

    res.render('index', {title: 'Etsy Clone', cartCount: req.session.cartCount, loggedIn: req.session.loggedIn, products: adjustedProducts});
}

module.exports = router;