'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoriqueTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoriqueTransaction.init({
    date: DataTypes.DATE,
    id_client: DataTypes.INTEGER,
    id_transaction: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistoriqueTransaction',
  });
  return HistoriqueTransaction;
};