const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../models/user");

exports.register = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/auth/register'
  // #swagger.method = 'post'
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para cadastrar um usuário.'
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const username = req.body.username;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  const cpf = req.body.cpf;
  bcrypt
    .hash(password, 12)
    .then((hashed_password) => {
      const user = new User({
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hashed_password,
        cpf: cpf,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User registered successfully", userId: result.id });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.login = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/auth/login'
  // #swagger.method = 'post'
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint para autenticar um usuário.'
  const login = req.body.login;
  const password = req.body.password;

  let found_user;
  User.findOne({
    where: {
      [Op.or]: [{ email: login }, { username: login }],
    },
  })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.status_code = 401;
        throw error;
      }
      found_user = user;
      bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (isEqual) {
        const error = new Error("Wrong password.");
        error.status_code = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          username: found_user.username,
          userId: found_user.id.toString(),
        },
        "1b93823c3837425690b259976639b5753644ca67",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: found_user.id.toString() });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};
