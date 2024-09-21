'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
   
    static associate(models) {
      this.belongsTo(models.post,{foreignKey:'PostId'});
      this.belongsTo(models.user,{foreignKey:'UserId'});
    }
  }
  like.init({
   id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      }
  }, {
    sequelize,
    modelName: 'like',
    timestamps:false
  });
  return like;
};