'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tracks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      track_id: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      hidden: {
        type: Sequelize.BOOLEAN
      },
      album_id: {
        type: Sequelize.UUID
      },
      artist_id: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tracks');
  }
};