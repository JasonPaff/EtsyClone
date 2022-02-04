'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.addColumn('Products', 'color', {
      allowNull: true,
      type: Sequelize.STRING
    },
        queryInterface.addColumn('Products', 'size', {
          allowNull: true,
          type: Sequelize.STRING
        }))


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

  }
};
