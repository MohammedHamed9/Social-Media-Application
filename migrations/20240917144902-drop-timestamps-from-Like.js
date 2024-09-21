'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
    });
    await queryInterface.addColumn('likes','UserId',{
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',    
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('likes','PostId',{
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'posts', 
        key: 'id',    
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');

  }
};
