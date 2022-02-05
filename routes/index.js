const express = require("express")
const router = express.Router()

const products = [{
    name: "test one",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 5.99,
}, {
    name: "test two",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 5.99,
}, {
    name: "test three",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 6.99,
}, {
    name: "test four",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 7.99
}, {
    name: "test five",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 8.99
}, {
    name: "test six",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    price: 3.99
},];

router.get('/', function (req, res) {
    res.render('index', {title: 'Etsy Clone', products: products});
});

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

    console.log(user);
}

module.exports = router