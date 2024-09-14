'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      username: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
      },
      email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,
      }, 
      password:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      profile_picture:{
        type:Sequelize.STRING,
        validate:{
          isUrl: true
        }
      },
      bio:{
        type:Sequelize.TEXT
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
    await queryInterface.dropTable('users');
  }
};