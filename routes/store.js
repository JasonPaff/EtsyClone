const express = require("express");
const models = require("../models");
const router = express.Router();

// TODO: load real products from database
const products = [{
    name: "test one", price: 5.99, sale_price: 4.99
}, {
    name: "test two", price: 5.99,
}, {
    name: "test three", price: 6.99,
}, {
    name: "test four", price: 7.99
}, {
    name: "test five", price: 8.99
}, {
    name: "test six", price: 3.99
},];

router.get('/', function (req, res) {
    res.render('store', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products});
});

router.post('/', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

// get all the stores from the database
async function getStoreProducts(req, res) {
    const products = await models.Product.findAll({
        where: {
            user_id: req.body.userId
        }
    })

    const store = await models.Store.findOne({
        where: {
            user_id: req.body.userId
        }
    })

    products.forEach(product => product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2))

    res.render('store', {
        title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products, store_name: store.store_name
    });
}

module.exports = router;