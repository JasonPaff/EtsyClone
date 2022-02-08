const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    addToCart(req).catch(console.error);
});

async function addToCart(req){
    if(req.session.loggedIn) {
        require('../utils/dbUtils').addProductToCart(req.body.productId, 1, req.session.user)
    }
}

module.exports = router;