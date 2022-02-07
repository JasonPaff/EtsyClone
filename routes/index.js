﻿const express = require("express");
const models = require("../models");
const router = express.Router();

router.get('/', function (req, res) {
    getAllProducts(req, res).catch(console.error);
});

async function getAllProducts(req, res) {
    // TODO: only find products that have a quantity over 1
    const products = await models.Product.findAll({});

    // create sale percents and flag as on sale
    products.forEach(product => {
        if (product.sale_price > 0)
        {
            product.onSale = true;
            product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
        }
    } )

    res.render('index', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products});
}

module.exports = router;