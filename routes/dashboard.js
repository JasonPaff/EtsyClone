const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    res.render('dashboard')
})

router.get('/add-store', (req, res) => {
    res.render('add-store')
})

router.get('/edit-store', (req, res) => {
    res.render('edit-store')
})

router.get('/add-product', (req, res) => {
    res.render('add-product')
})

router.get('/view-all-products', (req, res) => {
    //get stuff from products table by session user id
    res.render('view-all-products')
})

router.get('/update-password', (req, res) => {
    res.render('update-password')
})

router.get('/sign-out', (req, res) => {
    //destory session
    //req.session.destory
})

router.get('/view-reviews', (req, res) => {
    res.render('view-reviews')
})

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
})

router.get('/favorites', (req, res) => {
    res.render('favorites')
})





module.exports = router