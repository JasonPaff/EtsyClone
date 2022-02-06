const express = require("express");
const bcrypt = require("bcryptjs");
const models = require("../models");
const {Op} = require("sequelize");
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

router.get('/', function (req, res) {
    if (req.session.loggedIn)
        res.render('index', {title: 'Etsy Clone', loggedIn: req.session.loggedIn});
    else
        res.render('login', {
            title: 'Login/Register',
            client_id: "212320166072-k9ktehlapdde4her52obv0lhatd26s1v.apps.googleusercontent.com"
        });
});

router.post('/', function (req, res) {

    // TODO: use regex to confirm user entered a valid email address
    // TODO: use regex to confirm password is certain length and has at least 1 symbol

    handleLogin(req, res).catch(console.error);
});

// handle the account login logic
async function handleLogin(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // confirm account matching the email exists
    const hasAccount = await hasAccountAlready(models, Op, email);
    if (!hasAccount) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "Incorrect Email"});
        return;
    }

    // get the account information
    const account = await getAccount(email);
    if (account === null) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "No Account Exists"});
        return;
    }

    // compare the entered passwords hash with the database password hash
    const match = await comparePasswordHashes(password, account.dataValues.password);
    if (!match) {
        res.render('login', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, loginError: "Incorrect Password"});
        return;
    }

    req.session.loggedIn = true;
    req.session.user = account;

    res.render('index', {title: 'Etsy Clone', loggedIn: req.session.loggedIn, products: products});
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