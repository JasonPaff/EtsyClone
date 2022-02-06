const express = require("express");
const bcrypt = require('bcryptjs');
const models = require('../models')
const router = express.Router();

// TODO: load real products from database
const products = [{
    name: "test one",
    price: 5.99,
    sale_price: 4.99
}, {
    name: "test two",
    price: 5.99,
}, {
    name: "test three",
    price: 6.99,
}, {
    name: "test four",
    price: 7.99
}, {
    name: "test five",
    price: 8.99
}, {
    name: "test six",
    price: 3.99
},];

router.post('/', function (req, res) {
    const {OAuth2Client} = require('google-auth-library');
    let CLIENT_ID = "212320166072-k9ktehlapdde4her52obv0lhatd26s1v.apps.googleusercontent.com";
    const client = new OAuth2Client(CLIENT_ID);
    let email = "";

    // verify google auth and get email
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        return email;
    }

    verify()
        .then(email => findOrCreateUserAccount(email))
        .then((user) => {
            req.session.loggedIn = true;
            req.session.user = user;
            res.render('index', {title :'Etsy Clone', loggedIn: req.session.loggedIn, products: products }) })
        .catch(console.error);
});

// find/create the user account
async function findOrCreateUserAccount(email) {
    require('dotenv').config();

    // TODO: allow user to create a password when a google login creates an account

    // encrypt password
    const hashedPassword = await bcrypt.hash(process.env.GOOGLE_PASSWORD, 5);

    // find/create user account
    return await models.User.findOrCreate({
        where: {
            email: email
        },
        defaults: {
            email: email,
            password: hashedPassword
        }
    });
}

module.exports = router;