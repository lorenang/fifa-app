const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Player = sequelize.define('Player', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fifa_version: DataTypes.STRING,
  long_name: DataTypes.STRING,
  player_positions: DataTypes.STRING,
  club_name: DataTypes.STRING,
  nationality_name: DataTypes.STRING,
  overall: DataTypes.INTEGER,
  pace: DataTypes.INTEGER,
  shooting: DataTypes.INTEGER,
  passing: DataTypes.INTEGER,
  dribbling: DataTypes.INTEGER,
  defending: DataTypes.INTEGER,
  physic: DataTypes.INTEGER
}, { tableName: 'players', timestamps: false });

module.exports = { Player };
