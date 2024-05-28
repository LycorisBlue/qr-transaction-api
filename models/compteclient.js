'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompteClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CompteClient.init({
    solde: DataTypes.DECIMAL,
    date_creation: DataTypes.DATE,
    id_client: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CompteClient',
  });
  return CompteClient;
};