const express = require("express");
const router = express.Router();

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
        return email
    }

    verify()
        .then(email => findOrCreateUserAccount(email))
        .then(() => { req.session.loggedIn = true; res.render('index', {title :'Etsy Clone', loggedIn: req.session.loggedIn}) })
        .catch(console.error);
})

// find/create the user account
async function findOrCreateUserAccount(email) {
    const models = require('../models')

    // find/create user account
    const user = await models.User.findOrCreate({
        where: {
            email: email
        },
        defaults: {
            email: email,
            password: "google"
        }
    });

    return user;
}

module.exports = router