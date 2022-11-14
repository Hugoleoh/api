const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const WriteInAnswer = sequelize.define(
  "write_in_answer",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    answer: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = WriteInAnswer;
