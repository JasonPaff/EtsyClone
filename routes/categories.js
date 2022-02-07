const express = require("express");
const router = express.Router();

// TODO: load real categories from database
const categories = [{
    name: 'Toys',
}, {
    name: 'Books',
}, {
    name: 'Clothing',
}, {
    name: 'Electronics',
}, {
    name: 'Something',
}];

router.get('/', function (req, res) {
    res.render('categories', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, categories: categories});
});

module.exports = router;