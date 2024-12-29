'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsTo(models.Artist, {foreignKey: 'artist_id'});
      Album.hasMany(models.Track, {foreignKey: 'album_id'});
    }
  }
  Album.init({
    album_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    year: {type: DataTypes.INTEGER, allowNull: false},
    hidden: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    artist_id: {type: DataTypes.UUID, allowNull: false}
  }, {
    sequelize,
    modelName: 'Album',
  });
  return Album;
};