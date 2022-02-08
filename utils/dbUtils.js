// calculates the sale prices for the products
function calculateSalePrices(products) {
    products.forEach(product => {
        if (product.sale_price > 0) {
            product.onSale = true;
            product.salePercent = ((1 - (product.sale_price / product.price)) * 100).toFixed(2);
        }
    });

    return products;
}

module.exports.calculateSalePrices = calculateSalePrices;