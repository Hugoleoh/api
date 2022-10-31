const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const ONE_HOUR = 3600000;
const ONE_YEAR = 31557600000;

const User = require("../models/user");

exports.register = (req, res, next) => {
  /* #swagger.start
  #swagger.path = '/auth/register'
  #swagger.method = 'post'
  #swagger.tags = ['Auth']
  #swagger.description = 'Endpoint para cadastrar um usuário.' 
  #swagger.parameters['user'] = {
    in: 'body',
    description: 'Informações do usuário.',
    required: true,
    schema: { 
      $ref: "#/definitions/user" 
    }
  }
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    /* 
          #swagger.responses[422] = { 
          description: 'Falha na validação' 
        }  
      */
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
      /* 
        #swagger.responses[201] = { 
          schema: { 
            userId: 1
          }
          description: 'Usuário criado.' 
        }  
      */
      const token = jwt.sign(
        {
          username: result.username,
          userId: result.id.toString(),
        },
        "1b93823c3837425690b259976639b5753644ca67",
        { expiresIn: ONE_HOUR }
      );
      res.status(201).json({
        message: "User registered successfully",
        userId: result.id,
        token: token,
      });
    })
    .catch((err) => {
      /* 
          #swagger.responses[500] = { 
          description: 'Server error' 
        }  
        */
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.login = (req, res, next) => {
  /*  #swagger.start
    #swagger.path = '/auth/login'
    #swagger.method = 'post'
    #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para autenticar um usuário.'
    #swagger.parameters['user'] = {
      in: 'body',
      description: 'Informações de login do usuário.',
      required: true,
      schema: { 
        login: 'username/email',
        password: 'secret', 
      }
    }
  */
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
        /* 
          #swagger.responses[404] = { 
          description: 'Usuário não encontrado.' 
        }  
        */
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      found_user = user;

      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            /* 
          #swagger.responses[401] = { 
          description: 'Não autorizado' 
        }  
        */
            const error = new Error("Wrong password.");
            error.statusCode = 401;
            throw error;
          }
          const token = jwt.sign(
            {
              username: found_user.username,
              userId: found_user.id.toString(),
            },
            "1b93823c3837425690b259976639b5753644ca67",
            { expiresIn: ONE_HOUR }
          );
          /* 
          #swagger.responses[200] = { 
          schema: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            userID: 1  
          },
          description: 'Usuário autenticado.' 
        }  
        */
          res.status(200).json({
            token: token,
            userId: found_user.id.toString(),
            createdAt: new Date(),
            expiresIn: expiresIn,
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            /* 
          #swagger.responses[500] = { 
          description: 'Server Error' 
        }  
        */
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        /* 
          #swagger.responses[500] = { 
          description: 'Server Error' 
        }  
        */
        err.statusCode = 500;
      }
      next(err);
    });
  // #swagger.end
};
