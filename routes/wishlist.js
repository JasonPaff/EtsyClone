const express = require("express")
const router = express.Router()

router.get('/', function(req, res) {
    res.render('wishlist', { title: 'Etsy Clone' });
});

module.exports = router