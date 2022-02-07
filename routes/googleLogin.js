const express = require("express");
const bcrypt = require('bcryptjs');
const models = require('../models')
const router = express.Router();

router.post('/', function (req, res) {
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let email = "";

    // verify google auth and get email
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload.email;
        return email;
    }

    verify()
        .then(email => findOrCreateUserAccount(email, res))
        .then((user) => {
            req.session.loggedIn = true;
            req.session.user = user;

            // go back to where we were if we redirected here to login
            if (req.session.redirect) {
                res.redirect(req.session.redirectUrl);
                req.session.redirect = false;
                req.session.redirectUrl = "";
            } else res.redirect('index');
        })
        .catch(console.error);
});

// find/create the user account
async function findOrCreateUserAccount(email, res) {
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