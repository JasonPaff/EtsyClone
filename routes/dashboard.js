const express = require("express")
const router = express.Router()

// TODO: change page title for each page instead of just the default?

router.get('/', (req, res) => {
    res.render('dashboard', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/add-store', (req, res) => {
    res.render('add-store', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/edit-store', (req, res) => {
    res.render('edit-store', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/add-product', (req, res) => {
    res.render('add-product', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/view-all-products', (req, res) => {
    //get stuff from products table by session user id
    res.render('view-all-products', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/update-password', (req, res) => {
    res.render('update-password', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    res.render('index', {title :'Etsy Clone', loggedIn: req.session.loggedIn} );
})

router.get('/view-reviews', (req, res) => {
    res.render('view-reviews', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
})

router.get('/favorites', (req, res) => {
    res.render('favorites', {title :'Etsy Clone', loggedIn: req.session.loggedIn});
})

module.exports = router