'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Favorite.init({
    favorite_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    user_id: {type: DataTypes.UUID, allowNull: false, references: {model: 'Users', key: 'user_id'}},
    category: {type: DataTypes.ENUM('artist', 'album', 'track'), allowNull: false},
    item_id: {type: DataTypes.UUID, allowNull: false},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};