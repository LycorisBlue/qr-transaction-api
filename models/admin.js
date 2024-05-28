'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  Admin.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    mot_de_passe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Admin',
    hooks: {
      beforeCreate: async (admin) => {
        const salt = await bcrypt.genSalt(10);
        admin.mot_de_passe = await bcrypt.hash(admin.mot_de_passe, salt);
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('mot_de_passe')) {
          const salt = await bcrypt.genSalt(10);
          admin.mot_de_passe = await bcrypt.hash(admin.mot_de_passe, salt);
        }
      }
    }
  });

  return Admin;
};
