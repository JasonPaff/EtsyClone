'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stores', {
      store_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      store_name: {
        type: Sequelize.STRING
      },
      store_description: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', field: 'product_id' }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', field: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stores');
  }
};