const express = require("express");
const models = require("../models");
const router = express.Router();

router.get('/', function (req, res) {
    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    // TODO: only find products that have a quantity over 1
    const allProducts = await models.Product.findAll({});

    // filter out products not on sale
    const products = allProducts.filter(product => product.sale_price !== 'NaN');

    // create sale percents and flag anything that is on sale
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);

    res.render('products', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: adjustedProducts});
}

module.exports = router;