'use strict';
const bcrypt=require('bcrypt')
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.hasMany(models.post,{foreignKey:'UserId'});
      this.hasMany(models.like,{foreignKey:'UserId'});
      this.hasMany(models.comment,{foreignKey:'UserId'});
      this.hasMany(models.message,{as:'sending',foreignKey:'senderId'});
      this.hasMany(models.message,{as:'receiving',foreignKey:'receiverId'});
      this.hasMany(models.notification,{foreignKey:'UserId'});
      this.belongsToMany(models.user,
        {as:'followers',
        through:'userFollowers',
        foreignKey: 'followingId'
      });
      this.belongsToMany(models.user, {
        as: 'following', 
        through: 'userFollowers', 
        foreignKey: 'followerId'
      });
    }
  }
  user.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates a UUIDv4 value
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: {
          args: [2, 30],
          msg: 'Username must be between 2 and 10 characters long.',
        },
      }
    },
    email:{
      type:DataTypes.STRING,
      unique:true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address.',
        },
      } 
    }, 
    password:{
      type:DataTypes.STRING,
      allowNull: false,
      validate:{
        len: {
          args: [2, 30],
          msg: 'password must be between 8 and 30 characters long.',
        },
      }
    },
    profile_picture:{
      type:DataTypes.STRING,
    },
    bio:{
      type:DataTypes.TEXT
    }
    ,
    createdAt:{
      type:DataTypes.DATE,
      allowNull:true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type:DataTypes.DATE,
      allowNull:true,
    },
    deletedAt:{
      type:DataTypes.DATE,
      allowNull: true, 
      defaultValue:null
    }
  }, {
    sequelize,
    modelName: 'user',
    paranoid: true,
    timestamps: true,
  });

  user.addHook('beforeSave', async (user, options) => {
    if (!user.changed('password')) return;
    
    user.password = await bcrypt.hash(user.password, 12);
  });

  return user;

};
