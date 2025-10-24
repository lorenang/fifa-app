const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'fifa_local',
  process.env.DB_USER || 'fifa',
  process.env.DB_PASS || 'fifa',
  {
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  }
);

module.exports = { sequelize };
