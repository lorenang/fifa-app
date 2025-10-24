// models/player.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Player = sequelize.define('Player', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fifa_version: { type: DataTypes.STRING, allowNull: false },
  fifa_update: { type: DataTypes.STRING },
  player_face_url: { type: DataTypes.STRING },
  long_name: { type: DataTypes.STRING, allowNull: false },
  player_positions: { type: DataTypes.STRING, allowNull: false },
  club_name: { type: DataTypes.STRING },
  nationality_name: { type: DataTypes.STRING },
  overall: { type: DataTypes.INTEGER, allowNull: false },
  potential: { type: DataTypes.INTEGER },
  value_eur: { type: DataTypes.INTEGER },
  wage_eur: { type: DataTypes.INTEGER },
  age: { type: DataTypes.INTEGER, allowNull: false },
  height_cm: { type: DataTypes.INTEGER },
  weight_kg: { type: DataTypes.INTEGER },
  preferred_foot: { type: DataTypes.STRING },
  weak_foot: { type: DataTypes.INTEGER },
  skill_moves: { type: DataTypes.INTEGER },
  international_reputation: { type: DataTypes.INTEGER },
  work_rate: { type: DataTypes.STRING },
  body_type: { type: DataTypes.STRING },
  pace: { type: DataTypes.INTEGER },
  shooting: { type: DataTypes.INTEGER },
  passing: { type: DataTypes.INTEGER },
  dribbling: { type: DataTypes.INTEGER },
  defending: { type: DataTypes.INTEGER },
  physic: { type: DataTypes.INTEGER },
}, { tableName: 'players', timestamps: false });

module.exports = Player;
