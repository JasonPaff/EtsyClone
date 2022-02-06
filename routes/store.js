const express = require("express");
const router = express.Router();

// TODO: load real products from database
const products = [{
    name: "test one",
    price: 5.99,
    sale_price: 4.99
}, {
    name: "test two",
    price: 5.99,
}, {
    name: "test three",
    price: 6.99,
}, {
    name: "test four",
    price: 7.99
}, {
    name: "test five",
    price: 8.99
}, {
    name: "test six",
    price: 3.99
},];

router.get('/', function(req, res) {
    res.render('store', { title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products });
});

module.exports = router;