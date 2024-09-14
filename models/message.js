'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
   
    static associate(models) {
      this.belongsTo(models.user,{as:'sending',foreignKey:'senderId'})
      this.belongsTo(models.user,{as:'receiving',foreignKey:'receiverId'})
    }
  }
  message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull:false
      },
      senderId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
          model:'user',
          key:'id'
        }
      },
      receiverId:{
        type:DataTypes.UUID,
        allowNull:false,
        references:{
          model:'user',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
  }, {
    sequelize,
    modelName: 'message',
    paranoid: true,
    timestamps: true,
  });
  return message;
};