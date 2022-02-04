'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.addColumn('Products', 'sale_price', {
      allowNull: true,
      type: Sequelize.INTEGER
    },
      queryInterface.addColumn('Products', 'view_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }))
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
