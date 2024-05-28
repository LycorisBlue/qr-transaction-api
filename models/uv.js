'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UV extends Model {
    static associate(models) {
      // define association here
    }
  }

  UV.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UV',
  });

  return UV;
};
