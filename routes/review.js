const express = require("express");
const router = express.Router();

router.post('/', function (req, res) {
    res.redirect('order-history');
});

module.exports = router;