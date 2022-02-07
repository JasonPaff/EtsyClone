'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.hasMany(models.Product, { as: 'products', foreignKey: 'product_id' })
      models.Store.hasOne(models.User, { as: 'user', foreignKey: 'id' })
    }
  }
  Store.init({
    store_name: DataTypes.STRING,
    store_description: DataTypes.STRING, product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};