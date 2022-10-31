const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Poll = sequelize.define("poll", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  initial_date: Sequelize.DATE,
  end_date: Sequelize.DATE,
  sharing_url: Sequelize.STRING,
  description: Sequelize.STRING,
  started: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  privacy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  finished: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Poll;
