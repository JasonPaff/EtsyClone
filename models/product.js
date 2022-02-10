'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Product.hasMany(models.Review, { as: 'reviews', foreignKey: 'review_id' })
      models.Product.belongsTo(models.User, {
        as: 'user', foreignKey: "id"
      })
    }
  }
  Product.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    sale_price: DataTypes.INTEGER,
    view_count: DataTypes.INTEGER,
    category: DataTypes.STRING,
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    imageType: DataTypes.STRING,
    imageName: DataTypes.STRING,
    imageData: DataTypes.BLOB('long')
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
