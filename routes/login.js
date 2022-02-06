const express = require("express");
const bcrypt = require("bcryptjs");
const models = require("../models");
const {Op} = require("sequelize");
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.loggedIn)
        res.render('index', {title: 'Etsy Clone', loggedIn: req.session.loggedIn})
    else
        res.render('login', {
            title: 'Login/Register',
            client_id: "212320166072-k9ktehlapdde4her52obv0lhatd26s1v.apps.googleusercontent.com"
        });
});

router.post('/', function (req, res) {

    // TODO: use regex to confirm user entered a valid email address
    // TODO: add verification to force password to be a certain length and contain a symbol
    // TODO: make sure password and repeat password match

    handleLogin(req, res).catch(console.error);
});

// handle the login logic
async function handleLogin(req, res) {
    const models = require('../models')
    const {Op} = require('sequelize')

    const email = req.body.email;
    const password = req.body.password;
    const repeatPassword = req.body.repeatPassword;

    // confirm account matching the email exists
    const hasAccount = await hasAccountAlready(models, Op, email);
    if (!hasAccount) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, error: "Incorrect Email"})
        return;
    }

    // get the account information
    const account = await getAccount(email);
    if (account === null) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, error: "No Account Exists"})
        return;
    }

    // compare the entered passwords hash with the database password hash
    const newPasswordHash = await bcrypt.hash(password, 5);
    const match = await comparePasswordHashes(password, account.dataValues.password);
    if (!match) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, error: "Incorrect Password"})
        return;
    }

    req.session.loggedIn = true;
    req.session.user = account;

    res.render('index', {title: 'Etsy Clone', loggedIn: req.session.loggedIn})
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
async function comparePasswordHashes(newPasswordHash, oldPasswordHash) {
    return bcrypt.compare(newPasswordHash, oldPasswordHash);
}

module.exports = router;