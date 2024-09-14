'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userFollowers', {

      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,

      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userFollowers');
  }
};