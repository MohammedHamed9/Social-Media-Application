'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users','id',{
      type:Sequelize.UUID,
      primaryKey: true
    }) 
  },

  async down (queryInterface, Sequelize) {

  }
};
