const models = require("../models");
const sequelize = require("sequelize");

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

// add hasColor and hasSize flags
function addSizeColorFlags(products) {
    products.forEach(product => {
        if (product.category === 'Clothing') {
            product.hasSize = true;
            product.hasColor = true;
        }
    });

    return products;
}

// sort products by view count
function sortProductsByViewCount(products) {
    // sort helper
    function compareViews(a, b) {
        if (a.dataValues.view_count > b.dataValues.view_count)
            return -1;
        if (a.dataValues.view_count < b.dataValues.view_count)
            return 1;
        return 0;
    }
    products.sort(compareViews);

    return products;
}

// gets the store names for the products
async function getStoreNamesFromProducts(products) {
    let storeNames = [];
    // user_id from products need to match user_id on store for store name

    for (let c = 0; c < products.length; c++){
        let store = await models.Store.findOne({
            where : {
                user_id : products[c].dataValues.user_id
            }
        });

        if (store !== null){
            storeNames.push(store.dataValues.store_name);
        }
    }

    return storeNames;
}

// clears the users cart
async function clearUserCart(user) {
    const cart = await getUserCart(user);

    // get the ids and quantities
    let ids;
    let quantities;

    // reset
    ids = [];
    quantities = [];

    // update cart
    models.Cart.update({
        product_id: ids, quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // update database
    await cart.save().catch(console.error);
}

// returns a single product
async function getProduct(productId) {
    return await models.Product.findOne({
        where: {
            id: productId
        }
    })
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

// returns all the products from a certain category
async function getAllProductsByKeyword(keyword) {

    // description search
    const description = await models.Product.findAll({
        where: {
            description: sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', '%' + keyword.toLowerCase() + '%')
        }
    })

    // category search
    const category = await models.Product.findAll({
        where: {
            category: sequelize.where(sequelize.fn('LOWER', sequelize.col('category')), 'LIKE', '%' + keyword.toLowerCase() + '%')
        }
    })

    // name search
    const name = await models.Product.findAll({
        where: {
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + keyword.toLowerCase() + '%')
        }
    })

    // combine into one array and return
    return [...description, ...name, ...category];
}

// returns all the products in a cart
async function getAllCartProducts(cart) {
    const ids = cart.dataValues.product_id;
    const quantities = cart.dataValues.quantity;

    let products = [];

    // add products based on matching quantities
    for (let c = 0; c < ids.length; c++) {
        for (let d = 0; d < quantities[c]; d++) {
            const product = await getProduct(ids[c]);
            if (product !== null) products.push(product);
        }
    }

    return products;
}

// returns all the products in a wish list
async function getAllWishlistProducts(wishlist) {
    const ids = wishlist.dataValues.product_id;
    const quantities = wishlist.dataValues.quantity;

    let products = [];

    // add products based on matching quantities
    for (let c = 0; c < ids.length; c++) {
        for (let d = 0; d < quantities[c]; d++) {
            const product = await getProduct(ids[c]);
            if (product !== null) products.push(product);
        }
    }

    return products;
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

// returns the number of items in the cart
async function getCartCount(user) {
    const cart = await getUserCart(user);
    const quantities = cart.dataValues.quantity;

    if (quantities === null || quantities.length === 0) return 0;

    let count = 0;
    for (let c = 0; c < quantities.length; c++) {
        count += quantities[c];
    }

    return count;
}

// returns the user shopping cart
async function getUserCart(user) {
    const cart = await models.Cart.findOrCreate({
        where: {
            user_id: user.id
        }, defaults: {
            user_id: user.id, product_id: [], quantity: []
        }
    });

    return cart[0];
}

// returns the user shopping wish list
async function getUserWishlist(user) {
    const wishlist = await models.Wishlist.findOrCreate({
        where: {
            user_id: user.id
        }, defaults: {
            user_id: user.id, product_id: [], quantity: []
        }
    });

    return wishlist[0];
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
    await models.Cart.update({
        product_id: ids,
        quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // get product
    const product = await getProduct(productId);

    // update view count
    if (product.dataValues.view_count === null)
        product.dataValues.view_count = 1;
    else
        product.dataValues.view_count += 1;

    // update database
    await models.Product.update({
        view_count: product.dataValues.view_count
    }, {
        where: {
            id: productId
        }
    });

    // update database, maybe unnecessary?
    await cart.save().catch(console.error);
}

// adds a product to a logged-in users shopping cart
async function addProductToWishlist(productId, quantity, user) {
    // get the cart
    const wishlist = await getUserWishlist(user);

    // get the ids and quantities
    let ids = wishlist.dataValues.product_id;
    let quantities = wishlist.dataValues.quantity;

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
    await models.Wishlist.update({
        product_id: ids,
        quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // update database, maybe unnecessary?
    await wishlist.save().catch(console.error);
}

// remove a product from a logged in users shopping cart
async function removeProductFromCart(productId, user) {
    // get the cart
    const cart = await require('../utils/dbUtils').getUserCart(user);

    // get the ids and quantities
    let ids = cart.dataValues.product_id;
    let quantities = cart.dataValues.quantity;

    // check for product in the ids array, returns -1 for no match
    const existingProductIndex = ids.findIndex(id => id == productId)

    // no matching product
    if (existingProductIndex === -1) return;

    // lower quantity by one
    quantities[existingProductIndex] -= 1;

    // if it's the last of that product remove it entirely
    if (quantities[existingProductIndex] <= 0) {
        ids.splice(existingProductIndex, 1);
        quantities.splice(existingProductIndex, 1);
    }

    // update cart
    models.Cart.update({
        product_id: ids, quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // update database
    await cart.save().catch(console.error);
}

// remove a product from a logged in users shopping cart
async function removeProductFromWishlist(productId, user) {
    // get the cart
    const wishlist = await require('../utils/dbUtils').getUserWishlist(user);

    // get the ids and quantities
    let ids = wishlist.dataValues.product_id;
    let quantities = wishlist.dataValues.quantity;

    // check for product in the ids array, returns -1 for no match
    const existingProductIndex = ids.findIndex(id => id == productId)

    // no matching product
    if (existingProductIndex === -1) return;

    // lower quantity by one
    quantities[existingProductIndex] -= 1;

    // if it's the last of that product remove it entirely
    if (quantities[existingProductIndex] <= 0) {
        ids.splice(existingProductIndex, 1);
        quantities.splice(existingProductIndex, 1);
    }

    // update cart
    models.Wishlist.update({
        product_id: ids, quantity: quantities
    }, {
        where: {
            user_id: user.id
        }
    });

    // update database
    await wishlist.save().catch(console.error);
}

// returns the list of categories
function getCategoriesList() {
    return [{
        name: 'Toys',
        image: "assets/images/toys.jpg"
    }, {
        name: 'Books',
        image: "assets/images/books.jpg"
    }, {
        name: 'Clothing',
        image: "assets/images/cloths.jpg"
    }, {
        name: 'Electronics',
        image: "assets/images/electronics.jpg"
    }, {
        name: 'Food',
        image: "assets/images/food.jpg"
    }, {
        name: 'Misc',
        image: "assets/images/miscc.jpg"
    }];
}

module.exports.calculateSalePrices = calculateSalePrices;
module.exports.getAllProducts = getAllProducts;
module.exports.getAllUserProducts = getAllUserProducts;
module.exports.getAllSaleProducts = getAllSaleProducts;
module.exports.getAllCartProducts = getAllCartProducts;
module.exports.getAllWishlistProducts = getAllWishlistProducts;
module.exports.getAllStockedProducts = getAllStockedProducts;
module.exports.getAllProductsByCategory = getAllProductsByCategory;
module.exports.getAllProductsByKeyword = getAllProductsByKeyword;
module.exports.getAllStores = getAllStores;
module.exports.getUserStore = getUserStore;
module.exports.getUserCart = getUserCart;
module.exports.getUserWishlist = getUserWishlist;
module.exports.getCartCount = getCartCount;
module.exports.getCategoriesList = getCategoriesList;
module.exports.addProductToCart = addProductToCart;
module.exports.addProductToWishlist = addProductToWishlist;
module.exports.removeProductFromCart = removeProductFromCart;
module.exports.removeProductFromWishlist = removeProductFromWishlist;
module.exports.getCategoriesList = getCategoriesList;
module.exports.addSizeColorFlags = addSizeColorFlags;
module.exports.sortProductsByViewCount = sortProductsByViewCount;
module.exports.clearUserCart = clearUserCart;
module.exports.getStoreNamesFromProducts = getStoreNamesFromProducts;