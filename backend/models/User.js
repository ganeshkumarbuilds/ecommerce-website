const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: DataTypes.STRING,
  cartData: DataTypes.JSON,
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = User;