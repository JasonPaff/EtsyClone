'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Cart.hasOne(models.User, { as: 'user', foreignKey: 'id' })
      models.Cart.hasMany(models.Product, { as: 'products', foreignKey: 'id' })
    }
  }
  Cart.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.ARRAY(DataTypes.INTEGER),
    quantity: DataTypes.ARRAY(DataTypes.INTEGER),
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};