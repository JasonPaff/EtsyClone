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
    const products = await models.Product.findAll({});
    products.map(product => {
        const productImage = product.imageData.toString('base64')
        product['imageData'] = productImage
    });

    return products;
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
module.exports.getAllSaleProducts = getAllSaleProducts;
module.exports.getAllStockedProducts = getAllStockedProducts;
module.exports.getAllProductsByCategory = getAllProductsByCategory;
module.exports.getAllStores = getAllStores;
module.exports.getCategoriesList = getCategoriesList;
