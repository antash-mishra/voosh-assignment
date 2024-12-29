'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Artist.hasMany(models.Album, {foreignKey: 'artist_id'});
      Artist.hasMany(models.Track, {foreignKey: 'artist_id'});
    }
  }
  Artist.init({
    artist_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    grammy: {type: DataTypes.INTEGER, defaultValue: 0},
    hidden: {type: DataTypes.BOOLEAN, allowNull: false},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  }, {
    sequelize,
    modelName: 'Artist',
  });
  return Artist;
};