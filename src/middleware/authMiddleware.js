const User = require("../models/user");
module.exports = {
  checkEmailAvailability: function (req, _res, next) {
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) {
          const error = new Error("Email already taken.");
          error.statusCode = 409;
          throw error;
        } else {
          next();
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  checkUsernameAvailability: function (req, _res, next) {
    User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        if (user) {
          const error = new Error("Username already taken.");
          error.statusCode = 409;
          throw error;
        } else {
          next();
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  checkCpfAvailability: function (req, _res, next) {
    User.findOne({ where: { cpf: req.body.cpf } })
      .then((user) => {
        if (user) {
          const error = new Error("CPF already taken.");
          error.statusCode = 409;
          throw error;
        } else {
          next();
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
};
