'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Client, { as: 'sender', foreignKey: 'sender_id' });
      Transaction.belongsTo(models.Client, { as: 'recipient', foreignKey: 'recipient_id' });
      Transaction.belongsTo(models.Agent, { as: 'agent', foreignKey: 'agent_id' });
    }
  }

  Transaction.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};
