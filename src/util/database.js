const Sequelize = require("sequelize");

const sequelize = new Sequelize("pollar", "root", "", {
  dialect: "mariadb",
  host: "localhost",
});

module.exports = sequelize;
