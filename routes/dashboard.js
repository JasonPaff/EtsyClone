const express = require("express");
const router = express.Router();
const models = require('../models')
const multer = require('multer')
const upload = multer({ dest: './uploads/', storage: multer.memoryStorage() })
const bcrypt = require("bcryptjs");


router.get('/', (req, res) => {
    if (req.session.user.isActive) {
        res.render('dashboard/dashboard', { title: 'Etsy Clone - Dashboard', session: req.session });
    }
});

router.get('/add-store', (req, res) => {
    res.render('dashboard/add-store', { title: 'Etsy Clone - Add Store', session: req.session });
});

router.post('/add-store', upload.single('storeImage'), (req, res) => {
    const storeAdded = {
        user_id: req.session.user.id,
        store_name: req.body.storeName,
        store_description: req.body.storeDescription
    }

    // checks to see if an image was attached
    if (req.file) {
        storeAdded.imageType = req.file.mimetype
        storeAdded.image = req.file.originalname
        storeAdded.imageData = req.file.buffer.toString('base64')
    }

    models.Store.create(storeAdded)
        .then(() => {
            res.redirect('/dashboard')
        }).catch(error => {
            res.render('dashboard/add-store', { errorMessage: 'Unable to save store!' })
        })
})

router.get('/edit-store', async (req, res) => {
    const store = await models.Store.findOne({
        where: {
            user_id: req.session.user.id
        }
    })
    if (store === null) {
        res.redirect('/dashboard')
    } else {
        let storeData;
        if (store !== null || store.dataValues !== null)
            storeData = store.dataValues;
        res.render('dashboard/edit-store', { title: 'Etsy Clone - Edit Store', session: req.session, storeData });
    }
})

router.post('/edit-store/:id', upload.single('storeImage'), (req, res) => {
    const storeEdited = {
        store_name: req.body.storeName,
        store_description: req.body.storeDescription
    }

    // checks to see if an image was attached
    if (req.file) {
        storeEdited.imageType = req.file.mimetype
        storeEdited.image = req.file.originalname
        storeEdited.imageData = req.file.buffer.toString('base64')
    }

    models.Store.update(storeEdited, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.redirect('/dashboard')
    }).catch(error => {
        res.render('dashboard/add-product', { errorMessage: 'Error, unable to save store!' })
    })
})

router.get('/add-product', (req, res) => {
    res.render('dashboard/add-product', { title: 'Etsy Clone - Add Product', session: req.session });
});

router.post('/add-product', upload.single('productImage'), (req, res) => {
    const productAdded = {
        user_id: req.session.user.id,
        name: req.body.productName,
        description: req.body.productDescription,
        price: parseFloat(req.body.productPrice).toFixed(2),
        sale_price: parseFloat(req.body.salePrice).toFixed(2),
        category: req.body.productCategory,
        color: req.body.productColor,
        size: req.body.productSize
    }

    // checks to see if an image was attached
    if (req.file) {
        productAdded.imageType = req.file.mimetype
        productAdded.imageName = req.file.originalname
        productAdded.imageData = req.file.buffer.toString('base64')
    }

    models.Product.create(productAdded)
        .then(() => {
            res.redirect('/dashboard')
        }).catch(error => {
            res.render('dashboard/add-product', { errorMessage: 'Error, unable to save product!' })
        })
})

router.post('/edit-product', (req, res) => {
    models.Product.findOne({
        where: {
            id: req.body.productId
        }
    }).then(product => {
        const productData = product.dataValues
        if (productData.sale_price == 'NaN') {
            productData.sale_price = ''
        }
        res.render('dashboard/edit-product', { data: { title: 'Etsy Clone - Edit Product', session: req.session }, productData });
    })
})

router.post('/edit-product/:id', upload.single('productImage'), (req, res) => {
    const productEdited = {
        name: req.body.productName,
        description: req.body.productDescription,
        price: parseFloat(req.body.productPrice).toFixed(2),
        sale_price: parseFloat(req.body.salePrice).toFixed(2),
        category: req.body.productCategory,
        color: req.body.productColor,
        size: req.body.productSize
    }

    // checks to see if an image was attached
    if (req.file) {
        productEdited.imageType = req.file.mimetype
        productEdited.imageName = req.file.originalname
        productEdited.imageData = req.file.buffer.toString('base64')
    }

    models.Product.update(productEdited, {
        where: {
            id: req.params.id
        }
    })
        .then(() => {
            res.redirect('/dashboard')
        }).catch(error => {
            res.render('dashboard/add-product', { errorMessage: 'Error, unable to save product!' })
        })
})

router.post('/delete-product', (req, res) => {
    models.Product.destroy({
        where: {
            id: req.body.productId
        }
    }).then(() => {
        res.render('dashboard/dashboard', { title: 'Etsy Clone - Dashboard', loggedIn: req.session });
    })
})

router.get('/update-password', (req, res) => {
    res.render('dashboard/update-password', { title: 'Etsy Clone - Update Password', session: req.session });
});

router.post('/update-password', (req, res) => {
    models.User.findOne({
        where: {
            id: req.session.user.id
        }
    }).then(user => {
        bcrypt.compare(req.body.oldPassword, user.dataValues.password, (error, result) => {
            if (result) {
                if (req.body.newPassword == req.body.newPasswordConfirmed) {
                    bcrypt.hash(req.body.newPassword, 5)
                        .then((hashedPassword) => {
                            models.User.update({
                                password: hashedPassword
                            }, {
                                where: {
                                    id: req.session.user.id
                                }
                            }).then(() => {
                                res.redirect('/dashboard')
                            })
                        })

                } else {
                    res.render('dashboard/update-password', { errorMessage: 'Error, new passwords do not match!' })
                }
            } else {
                res.render('dashboard/update-password', { errorMessage: 'Error, password is not correct!' })
            }
        })
    })
})

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('./index');
});

router.get('/view-reviews', async (req, res) => {
    let reviews;

    reviews = await models.Review.findAll({
        where: {
            user_id: req.session.user.id
        }
    });

    let products = [];

    for (let c = 0; c < reviews.length; c++) {
        const product = await models.Product.findOne({
            where: {
                id: reviews[c].dataValues.product_id
            }
        });

        product.dataValues.rating = reviews[c].dataValues.rating;
        product.dataValues.review = reviews[c].dataValues.review_text;

        products.push(product);
    }

    res.render('dashboard/view-reviews', { title: 'Etsy Clone - View Your Reviews', session: req.session, products: products });
});

router.post('/deactivate-account', (req, res) => {
    deactivateReactivateAccount(req, res).catch(console.error);
});

router.post('/view-all-products', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

router.get('/order-history', async function (req, res) {
    // get the users orders
    const orders = await require('../utils/dbUtils').getOrders(req.session.user);

    for (let c = 0; c < orders.length; c++) {
        const total = parseFloat(orders[c].dataValues.order_total);
        orders[c].dataValues.order_total = total.toFixed(2);
    }

    // build product list from orders
    for (let c = 0; c < orders.length; c++) {
        orders[c].products = await require('../utils/dbUtils').getAllOrderProducts(orders[c]);
    }

    res.render('dashboard/order-history', { title: 'Etsy Clone', session: req.session, orders: orders })
});

async function getStoreProducts(req, res) {
    const products = await models.Product.findAll({
        where: {
            user_id: req.session.user.id
        }
    })
    if (products == []) {
        res.redirect('/dashboard')
    } else {

        const store = await models.Store.findOne({
            where: {
                user_id: req.session.user.id
            }
        })
        products.forEach(product => {
            if (product.sale_price > 0) {
                product.onSale = true;
                product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
            }
        })
        res.render('dashboard/view-all-products', {
            title: 'Etsy Clone - Your Products', session: req.session, products: products, store_name: store.store_name
        });
    }
}

async function getReviews(req, res) {

}

async function deactivateReactivateAccount(req, res) {
    const user = await models.User.findOne({
        where: {
            id: req.session.user.id
        }
    })
    if (user.dataValues.isActive) {
        await models.User.update({
            isActive: false
        }, {
            where: {
                id: req.session.user.id
            }
        })
        req.session.user.isActive = false
        res.redirect('../index');
    } else {
        await models.User.update({
            isActive: true
        }, {
            where: {
                id: req.session.user.id
            }
        })
        req.session.user.isActive = true
        res.redirect('../index');
    }
}

module.exports = router;
