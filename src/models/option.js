const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Option = sequelize.define("option", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  votes_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Option;
