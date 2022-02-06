const express = require("express")
const router = express.Router()

router.post('/', function(req, res) {
    console.log('register');
});

module.exports = router