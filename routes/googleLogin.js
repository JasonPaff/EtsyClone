const express = require("express");
const bcrypt = require('bcryptjs');
const models = require('../models')
const {OAuth2Client} = require("google-auth-library");
const router = express.Router();

router.post('/', function (req, res) {

    login(req, res).catch(console.error);

});

async function login(req, res) {

    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const email = await verify(req, client);

    if (!email) return;

    const user = await findOrCreateUserAccount(email);

    req.session.loggedIn = true;
    req.session.user = user[0];

    // cart size for ui
    req.session.cartCount = await require('../utils/dbUtils').getCartCount(user[0]);

    console.log(req.session.cartCount);

    // go back to where we were if we redirected here to login
    if (req.session.redirect) {
        res.redirect(req.session.redirectUrl);
        req.session.redirect = false;
        req.session.redirectUrl = "";
    } else res.redirect('index');
}

// verify google auth and get email
async function verify(req, client) {
    const ticket = await client.verifyIdToken({
        idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload.email;
}

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
        }, defaults: {
            email: email, password: hashedPassword
        }
    });
}

module.exports = router;