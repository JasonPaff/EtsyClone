const express = require("express")
const router = express.Router()
const models = require('../models')
const { Op } = require('sequelize')

router.get('/', (req, res) => {
    res.render('dashboard')
})

router.get('/add-store', (req, res) => {
    res.render('add-store')
})

router.post('/add-store', (req, res) => {
    const storeName = req.body.storeName
    const storeDescription = req.body.storeDescription
    const storeImage = req.body.storeImage
    // let store = models.Store.build
    // stuck here. store table is having issues migrating to DB
})

router.get('/edit-store', (req, res) => {
    res.render('edit-store')
})

router.post('/edit-store', (req, res) => {
    // get store values from DB
    const storeName = req.body.storeName
    const storeDescription = req.body.storeDescription
    const storeImage = req.body.storeImage
    // let store = models.
    // stuck here. store table is having issues migrating to DB
})

router.get('/add-product', (req, res) => {
    res.render('add-product')
})

router.post('/add-product', (req, res) => {
    const name = req.body.productName
    const description = req.body.productDescription
    const price = req.body.productPrice
    const salePrice = req.body.salePrice
    const image = req.body.productImage
    const category = req.body.productCategory
    const color = req.body.productColor
    const size = req.body.productSize
    let product = models.Product.build({
        name: name,
        description: description,
        price: price,
        image: image,
        category: category,
        size: size,
        color: color,
        sale_price: salePrice
    })
    console.log(product)
    product.save().then(savedProduct => {
        res.redirect('/dashboard/view-all-products')
    }).catch(error => {
        res.render('add-product', { errorMessage: 'Error, unable to save product!' })
    })
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