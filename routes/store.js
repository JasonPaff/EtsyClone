const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    getStores(req, res).catch(console.error);
});

router.post('/', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

// get all the store products from the database
async function getStoreProducts(req, res) {
    const products = await require('../utils/dbUtils').getAllUserProducts(req.body.userId);
    const store = await require('../utils/dbUtils').getUserStore(req.body.userId);
    const adjustedProducts = require('../utils/dbUtils').calculateSalePrices(products);

    res.render('store', {
        title: 'Etsy Clone', session: req.session, products: adjustedProducts, store_name: store.store_name
    });
}

// get all the stores from the database
async function getStores(req, res) {
    const stores = await require('../utils/dbUtils').getAllStores();
    res.render('stores', {title: 'Etsy Clone', session: req.session, stores: stores});
}
module.exports = router;