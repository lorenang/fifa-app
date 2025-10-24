// db.js — conexión Sequelize a MySQL (usa tus variables de entorno del compose)
const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_NAME = process.env.DB_NAME || 'fifa_local';
const DB_USER = process.env.DB_USER || 'fifa';
const DB_PASS = process.env.DB_PASS || 'fifa';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    // evita problemas con números grandes/decimales
    decimalNumbers: true
  }
});

module.exports = { sequelize };
