const express = require("express");
const router = express.Router();

// TODO: change page title for each page instead of just the default?

router.get('/', (req, res) => {
    res.render('dashboard/dashboard', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/add-store', (req, res) => {
    res.render('dashboard/add-store', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/edit-store', (req, res) => {
    res.render('dashboard/edit-store', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/add-product', (req, res) => {
    res.render('dashboard/add-product', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/view-all-products', (req, res) => {
    //get stuff from products table by session user id
    res.render('dashboard/view-all-products', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/update-password', (req, res) => {
    res.render('dashboard/update-password', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;

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

    res.render('index', {title :'Etsy Clone', loggedIn: req.session.loggedIn, products: products} );
});

router.get('/view-reviews', (req, res) => {
    res.render('dashboard/view-reviews', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
});

router.get('/favorites', (req, res) => {
    res.render('dashboard/favorites', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
});

module.exports = router;