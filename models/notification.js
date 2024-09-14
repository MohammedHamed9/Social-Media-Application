'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
  
    static associate(models) {
      this.belongsTo(models.user,{foreignKey:'UserId'});
    }
  }
  notification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type:{
      type:DataTypes.ENUM,
      values: ['like', 'comment', 'follow','message'],
      allowNull:false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    read_status: {
      type: DataTypes.BOOLEAN,
      default:false
    },
    UserId:{
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
    }
  }, {
    sequelize,
    modelName: 'notification',
    paranoid: true,
    timestamps: true,
  });
  return notification;
};