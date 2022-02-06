const express = require("express");
const router = express.Router();

// TODO: load real categories from database
const categories = [{
    name: 'toys',
}, {
    name: 'books',
}, {
    name: 'clothes',
}, {
    name: 'electronics',
}, {
    name: 'electronics',
}];

router.get('/', function(req, res) {
    res.render('categories', { title: 'Etsy Clone', loggedIn: req.session.loggedIn, categories: categories });
});

router.post('/', function( req, res){

});

module.exports = router;