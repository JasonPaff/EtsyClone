const express = require("express");
const router = express.Router();

// TODO: replace with real products from the users shopping cart
const products = [{
    name: "test one", price: 5.99, sale_price: 4.99
}, {
    name: "test two", price: 5.99,
},];

router.get('/', function (req, res) {
    res.render('cart', {title: 'Cart', loggedIn: req.session.loggedIn, products: products});
});

module.exports = router;