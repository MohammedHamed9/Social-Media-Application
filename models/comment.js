'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    static associate(models) {
      this.belongsTo(models.post,{foreignKey:'PostId'});
      this.belongsTo(models.user,{foreignKey:'UserId'});
    }
  }
  comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
        notEmpty: true
      }
    },
    PostId:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'post',
        key:'id'
      }
    },
    UserId:{
      type:DataTypes.UUID,
      allowNull:false,
      references:{
        model:'post',
        key:'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:new Date().toLocaleString()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'comment',
    paranoid: true,
    timestamps: true,
  });
  return comment;
};