const express = require("express")
const router = express.Router()

router.get('/', function(req, res) {
    res.render('product', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

module.exports = router