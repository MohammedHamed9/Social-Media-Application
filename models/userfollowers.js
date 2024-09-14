'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userFollowers extends Model {
  
    static associate(models) {
      this.belongsTo(models.user,{as:'followers',foreignKey:'followerId'})
      this.belongsTo(models.user,{as:'following',foreignKey:'followingId'})
    }
  }
  userFollowers.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    followerId:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'user',
        key:'id'
      }
    },
    followingId:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'user',
        key:'id'
      },
      deletedAt:{
        type:DataTypes.DATE,
        allowNull: true, 
        defaultValue:null
      }
    },
  }, {
    sequelize,
    modelName: 'userFollowers',
    paranoid: true,
    timestamps: true,
    createdAt: false, // Disable createdAt
    updatedAt: false, // Disable updatedAt
  });
  return userFollowers;
};