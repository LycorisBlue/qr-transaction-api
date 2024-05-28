'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // define association here
    }
  }

  // Fonction pour générer un contenu aléatoire de 16 caractères
  const generateQR = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let qr = '';
    for (let i = 0; i < 16; i++) {
      qr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return qr;
  };

  Client.init({
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
    qr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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
    modelName: 'Client',
    hooks: {
      beforeValidate: async (client) => {
        if (!client.qr) {
          client.qr = generateQR();  // Générer un QR code de 16 caractères
        }
      },
      beforeCreate: async (client) => {
        const salt = await bcrypt.genSalt(10);
        client.mot_de_passe = await bcrypt.hash(client.mot_de_passe, salt);
      },
      beforeUpdate: async (client) => {
        if (client.changed('mot_de_passe')) {
          const salt = await bcrypt.genSalt(10);
          client.mot_de_passe = await bcrypt.hash(client.mot_de_passe, salt);
        }
      }
    }
  });

  return Client;
};
