'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Wishlist.hasOne(models.User, { as: 'user', foreignKey: 'id' })
      models.Wishlist.hasMany(models.Product, { as: 'products', foreignKey: 'id' })
    }
  }
  Wishlist.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.ARRAY,
    quantity: DataTypes.ARRAY
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};
