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
});

module.exports = Poll;
