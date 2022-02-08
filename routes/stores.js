const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    getStores(req, res).catch(console.error);
});

async function getStores(req, res) {
    const stores = await require('../utils/dbUtils').getAllStores();
    res.render('stores', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, stores: stores});
}

module.exports = router;