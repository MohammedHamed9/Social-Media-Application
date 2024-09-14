'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.removeColumn('userfollowers','deletedAt')
    await queryInterface.addColumn('userfollowers','deletedAt',{
      type:Sequelize.DATE,
      defaultValue:null
    });
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
