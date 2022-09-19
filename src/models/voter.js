const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Voter = sequelize.define("voter", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  vote_weight: {
    type: Sequelize.INTEGER,
  },
  voter_key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Voter;
