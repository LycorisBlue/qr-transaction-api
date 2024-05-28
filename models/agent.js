'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    static associate(models) {
      // define association here
    }
  }

  Agent.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    mot_de_passe: {
      type: DataTypes.STRING,
      allowNull: false
    },
    solde: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    id_admin: {
      type: DataTypes.INTEGER,
      allowNull: true  // Allow null for now
    },
    photo_recto: {
      type: DataTypes.STRING,
      allowNull: true  // Allow null for now
    },
    photo_verso: {
      type: DataTypes.STRING,
      allowNull: true  // Allow null for now
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Agent',
    hooks: {
      beforeCreate: async (agent) => {
        const salt = await bcrypt.genSalt(10);
        agent.mot_de_passe = await bcrypt.hash(agent.mot_de_passe, salt);
      },
      beforeUpdate: async (agent) => {
        if (agent.changed('mot_de_passe')) {
          const salt = await bcrypt.genSalt(10);
          agent.mot_de_passe = await bcrypt.hash(agent.mot_de_passe, salt);
        }
      }
    }
  });

  return Agent;
};
