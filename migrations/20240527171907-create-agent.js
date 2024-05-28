'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Agents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mot_de_passe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      solde: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00
      },
      date_creation: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      id_admin: {
        type: Sequelize.INTEGER,
        allowNull: true  // Allow null for now
      },
      photo_recto: {
        type: Sequelize.STRING,
        allowNull: true  // Allow null for now
      },
      photo_verso: {
        type: Sequelize.STRING,
        allowNull: true  // Allow null for now
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Agents');
  }
};
