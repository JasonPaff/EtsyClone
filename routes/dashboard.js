const express = require("express");
const router = express.Router();
const models = require('../models')
const { Op } = require('sequelize')
// TODO: change page title for each page instead of just the default?

router.get('/', (req, res) => {
    res.render('dashboard/dashboard', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.get('/add-store', (req, res) => {
    res.render('dashboard/add-store', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.post('/add-store', (req, res) => {
    const name = req.body.storeName
    const description = req.body.storeDescription
    const image = req.body.storeImage
    let store = models.Store.build({
        store_name: name,
        store_description: description,
        image: image
    })
    console.log(store)
    store.save().then(savedStore => {
        res.redirect('/dashboard')
    }).catch(error => {
        res.render('dashboard/add-store', { errorMessage: 'Unable to save store!' })
    })

})

router.get('/edit-store', (req, res) => {
    res.render('dashboard/edit-store', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.post('/edit-store', (req, res) => {

})

router.get('/add-product', (req, res) => {
    res.render('dashboard/add-product', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.post('/add-product', (req, res) => {
    if (req.session.loggedIn) {
        console.log(req.session.user[0].id)
        const name = req.body.productName
        const description = req.body.productDescription
        const price = parseInt(req.body.productPrice)
        const salePrice = parseInt(req.body.salePrice)
        const image = req.body.productImage
        const category = req.body.productCategory
        const color = req.body.productColor
        const size = req.body.productSize
        let product = models.Product.build({
            user_id: req.session.user[0].id,
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
            res.redirect('/dashboard')
        }).catch(error => {
            res.render('dashboard/add-product', { errorMessage: 'Error, unable to save product!' })
        })
    }
})

router.get('/view-all-products', (req, res) => {
    //get stuff from products table by session user id
    res.render('dashboard/view-all-products', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.get('/update-password', (req, res) => {
    res.render('dashboard/update-password', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;

    res.redirect('index');
});

router.get('/view-reviews', (req, res) => {
    res.render('dashboard/view-reviews', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
});

router.get('/favorites', (req, res) => {
    res.render('dashboard/favorites', { title: 'Etsy Clone', loggedIn: req.session.loggedIn });
});

module.exports = router;
