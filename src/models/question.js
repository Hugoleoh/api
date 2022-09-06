const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Question = sequelize.define("question", {
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
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  num_options: {
    type: Sequelize.INTEGER,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Question;
