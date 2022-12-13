const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Voter = sequelize.define("voter", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  vote_weight: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  voter_key: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  has_voted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  voted_at: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  activated: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Voter;
