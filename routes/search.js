const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('search', {title: 'Etsy Clone', cartCount: req.session.cartCount, loggedIn: req.session.loggedIn});
});

module.exports = router;