'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Order.hasOne(models.User, { as: 'user', foreignKey: 'id' })
      models.Order.hasMany(models.Product, { as: 'products', foreignKey: 'id' })
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_total: DataTypes.DECIMAL,
    product_id: DataTypes.ARRAY(DataTypes.INTEGER),
    quantity: DataTypes.ARRAY(DataTypes.INTEGER),
    order_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};