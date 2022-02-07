'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.changeColumn('Products', 'price', {
      type: Sequelize.DECIMAL(10, 2)
    }),
      queryInterface.changeColumn('Products', 'sale_price', {
        type: Sequelize.DECIMAL(10, 2)
      })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
