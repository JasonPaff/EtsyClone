const express = require("express");
const router = express.Router();

router.get('/', async function (req, res) {

    const cart = await require('../utils/dbUtils').getUserCart(req.session.user);
    const products = await require('../utils/dbUtils').getAllCartProducts(cart);

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    let subTotal = 0;

    if (products !== null) {
        products.forEach(product => {
            subTotal += parseFloat(product.dataValues.price);
        });
    }

    const tax = subTotal * 0.05;
    const total = subTotal + tax;

    const orderNumber = generateRandomNumber();

    res.render('summary', {
        title: 'Order Summary',
        session: req.session,
        products: products,
        orderDate: today.toLocaleDateString(),
        orderNumber: orderNumber,
        orderTotal: total.toFixed(2)
    });

    await require('../utils/dbUtils').saveOrder(req.session.user, products, total, orderNumber);

    await require('../utils/dbUtils').clearUserCart(req.session.user);

    req.session.cartCount = 0;
});

// random invoice number
function generateRandomNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math
        .random() * (max - min + 1)) + min;
}

module.exports = router;