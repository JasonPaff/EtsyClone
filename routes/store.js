const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

// get all the stores from the database
async function getStoreProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllUserProducts(req.body.userId);
    const store = await require('../utils/dbUtils').getUserStore(req.body.userId);
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);

    res.render('store', {
        title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: adjustedProducts, store_name: store.store_name
    });
}

module.exports = router;