const express = require("express")
const router = express.Router()

router.get('/', function(req, res) {
    res.render('cart', { title: 'Cart' });
});

module.exports = router