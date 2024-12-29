'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Track.belongsTo(models.Album, {foreignKey: 'album_id'});
      Track.belongsTo(models.Artist, {foreignKey: 'artist_id'});
    }
  }
  Track.init({
    track_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    duration: {type: DataTypes.INTEGER, allowNull: false},
    hidden: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    album_id: {type: DataTypes.UUID, allowNull: false, references: {model: 'Albums', key: 'album_id'}},
    artist_id: {type: DataTypes.UUID, allowNull: false, references: {model: 'Artists', key: 'artist_id'}},
    createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
  }, {
    sequelize,
    modelName: 'Track',
  });
  return Track;
};