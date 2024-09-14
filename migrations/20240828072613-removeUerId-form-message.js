'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('messages','UserId');
  },

  async down (queryInterface, Sequelize) {
   
  }
};
