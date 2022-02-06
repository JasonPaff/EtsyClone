const express = require("express");
const router = express.Router();

// TODO: load real stores from database
const stores = [{
    name: "shop one",
}, {
    name: "shop two",
}, {
    name: "shop three",
}, {
    name: "shop four",
}, {
    name: "shop five",
}, {
    name: "shop six",
},];

router.get('/', function(req, res) {
    res.render('stores', { title: 'Etsy Clone', loggedIn: req.session.loggedIn, stores: stores });
});

module.exports = router;