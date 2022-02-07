'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Product, { as: 'products', foreignKey: 'id' })
      models.User.hasOne(models.Store, { as: 'store', foreignKey: 'id' })
      models.User.hasMany(models.Review, { as: 'reviews', foreignKey: 'id' })
      models.User.hasOne(models.Cart, { as: 'cart', foreignKey: 'id' })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
