const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('search', {title: 'Etsy Clone', session: req.session });
});

module.exports = router;