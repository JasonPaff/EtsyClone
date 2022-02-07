const express = require("express");
const router = express.Router();
const models = require('../models');
const { Op } = require('sequelize');
// TODO: change page title for each page instead of just the default?

const multer = require('multer');

// Create multer object
const imageUpload = multer({
    dest: 'images',
});

router.get('/', (req, res) => {
    res.render('dashboard/dashboard', { title: 'Etsy Clone - Dashboard', loggedIn: req.session.loggedIn });
});

router.get('/add-store', (req, res) => {
    res.render('dashboard/add-store', { title: 'Etsy Clone - Add Store', loggedIn: req.session.loggedIn });
});

router.post('/add-store', imageUpload.single('image'), (req, res) => {
    const name = req.body.storeName
    const description = req.body.storeDescription
    const image = req.body.storeImage
    let store = models.Store.build({
        user_id: req.session.user[0].id,
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
    models.Store.findOne({
        where: {
            user_id: req.session.user[0].id
        }
    }).then(store => {
        const storeData = store.dataValues
        console.log(storeData)
        res.render('dashboard/edit-store', { data: { title: 'Etsy Clone - Edit Store', loggedIn: req.session.loggedIn }, storeData });
    })
});

router.post('/edit-store', (req, res) => {

})

router.get('/add-product', (req, res) => {
    res.render('dashboard/add-product', { title: 'Etsy Clone - Add Product', loggedIn: req.session.loggedIn });
});

router.post('/add-product', (req, res) => {
    if (req.session.loggedIn) {
        const name = req.body.productName
        const description = req.body.productDescription
        const price = parseFloat(req.body.productPrice).toFixed(2)
        const salePrice = parseFloat(req.body.salePrice).toFixed(2)
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
        product.save().then(savedProduct => {
            res.redirect('/dashboard')
        }).catch(error => {
            res.render('dashboard/add-product', { errorMessage: 'Error, unable to save product!' })
        })
    }
})

router.get('/update-password', (req, res) => {
    res.render('dashboard/update-password', { title: 'Etsy Clone - Update Password', loggedIn: req.session.loggedIn });
});

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;

    res.redirect('index');
});

router.get('/view-reviews', async (req, res) => {
    const reviews = await models.Review.findAll({
        where: {
            user_id: req.session.user[0].id
        }
    })
    res.render('dashboard/view-reviews', { title: 'Etsy Clone - View Reviews', loggedIn: req.session.loggedIn, allReviews: reviews });
});

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
});

router.get('/wish-list', (req, res) => {
    res.render('dashboard/wish-list', { title: 'Etsy Clone - Wish List', loggedIn: req.session.loggedIn });
});

router.post('/view-all-products', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

async function getStoreProducts(req, res) {
    const products = await models.Product.findAll({
        where: {
            user_id: req.session.user[0].id
        }
    })
    const store = await models.Store.findOne({
        where: {
            user_id: req.session.user[0].id
        }
    })
    products.forEach(product => {
        if (product.sale_price > 0) {
            product.onSale = true;
            product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
        }
    })
    res.render('dashboard/view-all-products', {
        title: 'Etsy Clone - Your Products', loggedIn: req.session.loggedIn, products: products, store_name: store.store_name
    });
}

async function getReviews(req, res) {

}


module.exports = router;
