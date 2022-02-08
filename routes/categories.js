const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    res.render('categories', {
        title: 'Etsy Clone',
        loggedIn: req.session.loggedIn,
        categories: require('../utils/dbUtils').getCategoriesList()
    });
});

module.exports = router;