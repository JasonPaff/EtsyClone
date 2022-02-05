const express = require("express");
const router = express.Router();

router.get('/', function(req, res) {
    // TODO: Don't allow travel to login page if already logged in
    res.render('login', {
        title: 'Login/Register',
        client_id: "212320166072-k9ktehlapdde4her52obv0lhatd26s1v.apps.googleusercontent.com" });
});

module.exports = router;