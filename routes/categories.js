const express = require("express")
const router = express.Router()

router.get('/', function(req, res) {
    res.render('categories', { title: 'Etsy Clone' });
});

module.exports = router