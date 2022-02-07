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
      models.Store.hasMany(models.Product, { as: 'product', foreignKey: 'id' })
      models.Store.hasOne(models.User, { as: 'user', foreignKey: 'id' })
    }
  }
  Store.init({
    user_id: DataTypes.INTEGER,
    store_name: DataTypes.STRING,
    store_description: DataTypes.STRING,
    image: DataTypes.STRING,
    product_id: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};