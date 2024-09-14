'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'profile_picture', {
        type:Sequelize.STRING,
        allowNull:true,
    })
  },

  async down (queryInterface, Sequelize) {
  }
};
