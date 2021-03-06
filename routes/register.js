const express = require("express");
const bcrypt = require("bcryptjs");
const models = require("../models");
const {Op} = require("sequelize");
const router = express.Router();

router.post('/', function (req, res) {
    handleRegistration(req, res).catch(console.error);
});

// handle the account create logic
async function handleRegistration(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // see if an account matching the email exists already
    const hasAccount = await hasAccountAlready(models, Op, email);
    if (hasAccount) {
        res.render('login', {
            title: 'Etsy Clone', session: req.session.loggedIn, registrationError: "Account already exists"
        });
        // TODO: login screen reload needs to toggle to register on load so error message can be seen
        return;
    }

    // create user account
    const account = await createUserAccount(email, password);

    // flag login
    req.session.loggedIn = true;
    req.session.user = account;

    res.redirect('index');
}

// checks for an account existing in the database already
async function hasAccountAlready(models, Op, email) {
    const count = await models.User.count({
        where: {
            email: {
                [Op.iLike]: email
            }
        }
    });

    // flag whether account exists or not
    return count > 0;
}

// create the user account
async function createUserAccount(email, password) {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 5);

    // create the new user account
    return await models.User.create({
        email: email, password: hashedPassword
    });
}

module.exports = router;