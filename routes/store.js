const express = require("express");
const models = require("../models");
const router = express.Router();

router.post('/', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

// get all the stores from the database
async function getStoreProducts(req, res) {

    // get all the products
    const products = await models.Product.findAll({
        where: {
            user_id: req.body.userId
        }
    })

    // get the store
    const store = await models.Store.findOne({
        where: {
            user_id: req.body.userId
        }
    })

    // create sale percents and flag anything that is on sale
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);

    res.render('store', {
        title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: adjustedProducts, store_name: store.store_name
    });
}

module.exports = router;