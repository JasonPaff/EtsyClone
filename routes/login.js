const express = require("express");
const bcrypt = require("bcryptjs");
const models = require("../models");
const {Op} = require("sequelize");
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.loggedIn) res.redirect('index'); else {
        res.render('login', {
            title: 'Login/Register', client_id: process.env.GOOGLE_CLIENT_ID
        });
    }
});

router.post('/', function (req, res) {
    handleLogin(req, res).catch(console.error);
});

// handle the account login logic
async function handleLogin(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // confirm account matching the email exists
    const hasAccount = await hasAccountAlready(models, Op, email);
    if (!hasAccount) {
        res.render('login', {
            title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "Incorrect Email/Password"
        });
        return;
    }

    // get the account information
    const account = await getAccount(email);
    if (account === null) {
        res.render('login', {
            title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "Incorrect Email/Password"
        });
        return;
    }

    // compare the entered passwords hash with the database password hash
    const match = await comparePasswordHashes(password, account.dataValues.password);
    if (!match) {
        res.render('login', {
            title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "Incorrect Email/Password"
        });
        return;
    }

    // flag login
    req.session.loggedIn = true;
    req.session.user = account[0];

    // cart size for ui
    req.session.cartCount = require('../utils/dbUtils').getCartCount(account[0]);

    // return if we redirected here to log in
    if (req.session.redirect) {
        res.redirect(req.session.redirectUrl);
        req.session.redirect = false;
        req.session.redirectUrl = "";
    } else res.redirect('index')
}

// checks for an account existing in the database already
async function hasAccountAlready(models, Op, email) {
    const count = await models.User.count({
        where: {
            email: {
                [Op.iLike]: email
            }
        }
    })

    // flag whether account exists or not
    return count > 0;
}

// returns an account based on the email, returns null if no account is found
async function getAccount(email) {
    return await models.User.findOne({
        where: {
            email: {
                [Op.iLike]: email
            }
        }
    })
}

// compare supplied password to hash from database
async function comparePasswordHashes(newPassword, oldPasswordHash) {
    return bcrypt.compare(newPassword, oldPasswordHash);
}

module.exports = router;