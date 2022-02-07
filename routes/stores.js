const express = require("express");
const router = express.Router();
const models = require("../models");

router.get('/', function (req, res) {
    getStores().then((stores) => {
        res.render('stores', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, stores: stores});
    }).catch(console.error);
});

// get all the stores from the database
async function getStores() {
    return await models.Store.findAll({})
}

module.exports = router;