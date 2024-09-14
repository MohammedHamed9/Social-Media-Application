'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.changeColumn('posts','image_url',{
        type: Sequelize.JSON
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'image_url', {
      type: Sequelize.STRING,  // Change it back to a single string
      allowNull: true,  // This can match the original configuration before the change
    });
  }
};
