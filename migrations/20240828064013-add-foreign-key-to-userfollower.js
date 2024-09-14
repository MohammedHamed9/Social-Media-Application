'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('messages','followerId');
    await queryInterface.removeColumn('messages','followingId');

    await queryInterface.addColumn('userfollowers','followerId',{
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',    
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addColumn('userfollowers','followingId',{
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',    
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
