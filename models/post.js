'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {

    static associate(models) {
      this.belongsTo(models.user,{foreignKey:'UserId',as:'postOwner'});
      this.hasMany(models.comment,{foreignKey:'PostId'});
      this.hasMany(models.like,{foreignKey:'PostId'});
    }
  }
  post.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      content:{
        type:DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.JSON
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
        type: DataTypes.DATE,
        defaultValue:new Date().toLocaleString()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
  }, {
    sequelize,
    modelName: 'post',
    paranoid: true,
    timestamps: true,
  });
  return post;
};