'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      type:{
        type:Sequelize.ENUM,
        values: ['like', 'comment', 'follow','message'],
        allowNull:false
      },
      message: {  
        type: Sequelize.TEXT,
        allowNull:false
      },
      read_status: {
        type: Sequelize.BOOLEAN,
        default:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('notifications');
  }
};
