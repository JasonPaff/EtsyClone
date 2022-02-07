const express = require("express");
const models = require("../models");
const router = express.Router();

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

    products.forEach(product => {
        if (product.sale_price > 0)
        {
            product.onSale = true;
            product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
        }
    } )

    res.render('store', {
        title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products, store_name: store.store_name
    });
}

module.exports = router;