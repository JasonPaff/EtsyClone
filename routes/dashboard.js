const express = require("express");
const router = express.Router();
const models = require('../models')
const { Op } = require('sequelize')
// TODO: change page title for each page instead of just the default?

const multer = require('multer')
const upload = multer({ dest: './uploads/', storage: multer.memoryStorage() })

router.get('/', (req, res) => {
    //getting store + image

    // models.Store.findOne({
    //     where: {
    //         user_id: req.session.user.id
    //     }
    // }).then(store => {
    //     console.log(store)
    //     const storeImage = store.dataValues.imageData.toString('base64')
    //     store['imageData'] = storeImage
    res.render('dashboard/dashboard', { title: 'Etsy Clone', session: req.session });
    // })
});


router.get('/add-store', (req, res) => {
    // models.Store.findOne({
    //     where: {
    //         user_id: req.session.user.id
    //     }
    // }).then(store => {
    //     if (store.dataValues.user_id == req.session.user.id) {
    //         res.render('dashboard/dashboard', { errorMessage: "You already have a store. Please click Edit Store to update your store's information." })
    //     }
    // })
    res.render('dashboard/add-store', { title: 'Etsy Clone', session: req.session });
});

router.post('/add-store', upload.single('storeImage'), (req, res) => {
    const storeAdded = {
        user_id: req.session.user.id,
        store_name: req.body.storeName,
        store_description: req.body.storeDescription
    }

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

router.get('/edit-store', (req, res) => {
    models.Store.findOne({
        where: {
            user_id: req.session.user.id
        }
    }).then(store => {
        const storeData = store.dataValues
        res.render('dashboard/edit-store', { data: { title: 'Etsy Clone', session: req.session }, storeData });
    })
})

router.post('/edit-store/:id', upload.single('storeImage'), (req, res) => {
    const storeEdited = {
        store_name: req.body.storeName,
        store_description: req.body.storeDescription
    }

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
    res.render('dashboard/add-product', { title: 'Etsy Clone', session: req.session });
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

router.get('/update-password', (req, res) => {
    res.render('dashboard/update-password', { title: 'Etsy Clone', session: req.session });
});

router.get('/sign-out', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;

    res.redirect('index');
});

router.get('/view-reviews', async (req, res) => {
    const reviews = await models.Review.findAll({
        where: {
            user_id: req.session.user.id
        }
    })
    res.render('dashboard/view-reviews', { title: 'Etsy Clone', session: req.session, allReviews: reviews });
});

router.post('/delete-account', (req, res) => {
    //models.User.destory + cascade products, cart, reviews
});

router.get('/favorites', (req, res) => {
    res.render('dashboard/favorites', { title: 'Etsy Clone', session: req.session });
});

router.post('/view-all-products', function (req, res) {
    getStoreProducts(req, res).catch(console.error);
});

async function getStoreProducts(req, res) {
    const products = await models.Product.findAll({
        where: {
            user_id: req.session.user.id
        }
    })

    // products.map(product => {
    //     const productImage = product.imageData.toString('base64')
    //     product['imageData'] = productImage
    // })

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
        title: 'Etsy Clone', session: req.session, products: products, store_name: store.store_name
    });
}

async function getReviews(req, res) {

}


module.exports = router;