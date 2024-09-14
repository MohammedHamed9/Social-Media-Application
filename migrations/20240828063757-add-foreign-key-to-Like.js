'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
   
  }
};
