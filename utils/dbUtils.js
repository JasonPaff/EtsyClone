const models = require("../models");

// calculates any sale price percentages and flag the producat as on sale
function calculateSalePrices(products) {
    products.forEach(product => {
        if (product.sale_price > 0) {
            product.onSale = true;
            product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
        }
    });

    return products;
}

// returns all the products
async function getAllProducts() {
    return await models.Product.findAll({});
}

// returns all the products
async function getAllUserProducts(userId) {
    return await models.Product.findAll({
        where: {
            user_id: userId
        }
    });
}

// returns all the products with a stock quantity >= 1
async function getAllStockedProducts() {
    // TODO: quantity >= 1
    return await models.Product.findAll({});
}

// returns all the products from a certain category
async function getAllProductsByCategory(category) {
    return await models.Product.findAll({
        where: {
            category: category
        }
    });
}

// returns all the products on sale
async function getAllSaleProducts() {
    const products = await getAllProducts();
    return products.filter(product => product.sale_price !== 'NaN');
}

// returns all the stores
async function getAllStores() {
    return await models.Store.findAll({});
}

// returns all the stores
async function getUserStore(userId) {
    return await models.Store.findOne({
        where: {
            user_id: userId
        }
    });
}

// returns the user shopping cart
async function getUserCart(user) {
    const cart = await models.Cart.findOrCreate({
        where: {
            user_id: user.id
        }, defaults: {
            user_id: user.id,
            product_id: [],
            quantity: []
        }
    });

    return cart[0];
}

// adds a product to a logged-in users shopping cart
async function addProductToCart(productId, quantity, user) {
    // get the cart
    const cart = await getUserCart(user);

    // get the ids and quantities
    let ids = cart.dataValues.product_id;
    let quantities = cart.dataValues.quantity;

    // check for existing product in the ids array, returns -1 for no match
    const existingProductIndex = ids.findIndex(id => id == productId)

    // match found, update quantity
    if (existingProductIndex !== -1) {
        quantities[existingProductIndex] += quantity;
    }
    else { // no match, add new
        ids.push(productId);
        quantities.push(quantity);
    }

    // update cart
    models.Cart.update({
        product_id: ids,
        quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // update database
    await cart.save().catch(console.error);
}

// remove a product from a logged in users shopping cart
async function removeProductFromCart(productId) {

}

// returns the list of categories
function getCategoriesList() {
    return [{
        name: 'Toys',
    }, {
        name: 'Books',
    }, {
        name: 'Clothing',
    }, {
        name: 'Electronics',
    }, {
        name: 'Something',
    }];
}

module.exports.calculateSalePrices = calculateSalePrices;
module.exports.getAllProducts = getAllProducts;
module.exports.getAllUserProducts = getAllUserProducts;
module.exports.getAllSaleProducts = getAllSaleProducts;
module.exports.getAllStockedProducts = getAllStockedProducts;
module.exports.getAllProductsByCategory = getAllProductsByCategory;
module.exports.getAllStores = getAllStores;
module.exports.getUserStore = getUserStore;
module.exports.getCategoriesList = getCategoriesList;
module.exports.addProductToCart = addProductToCart;
module.exports.removeProductFromCart = removeProductFromCart;
