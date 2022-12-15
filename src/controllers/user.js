const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.edit = (req, res, next) => {
  /*  #swagger.start
  #swagger.path = '/users/edit/{userId}'
  #swagger.tags = ['Users']
  #swagger.method = 'put'
  #swagger.description = 'Endpoint para editar um usuário.'
  #swagger.parameters['userId'] = { description: 'ID do usuário.' } 
  #swagger.parameters['user'] = {
    in: 'body',
    description: 'Informações do usuário.',
    required: true,
    schema: { 
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@email.com'
    }
  }
  */

  const userId = req.params.userId;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;

  User.findByPk(userId)
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
      if (user.id != req.userId) {
        /* 
          #swagger.responses[403] = { 
          description: 'Não autorizado' 
        }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      return user.save();
    })
    .then((result) => {
      /* 
          #swagger.responses[200] = { 
          schema: {
            userId: 1  
          },
          description: 'Usuário editado.' 
        }  
      */
      res.status(200).json({ message: "User updated.", userId: result.id });
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

exports.changePassword = (req, res, next) => {
  /*  #swagger.start
  #swagger.path = '/users/password/change/{userId}'
  #swagger.tags = ['Users']
  #swagger.method = 'patch'
  #swagger.description = 'Endpoint para trocar a senha um usuário.'
  #swagger.parameters['userId'] = { description: 'ID do usuário.' } 
  #swagger.parameters['password'] = {
    in: 'body',
    description: 'Informações do usuário.',
    required: true,
    schema: { 
     current: 123456,
     new: 654321
    }
  }
  */

  const userId = req.params.userId;
  const currentPassword = req.body.current;
  const newPassord = req.body.new;

  User.findByPk(userId)
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
      if (user.id != req.userId) {
        /* 
          #swagger.responses[403] = { 
          description: 'Não autorizado' 
        }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      const result = bcrypt.compareSync(currentPassword, user.password);
      if (!result) {
        /* 
          #swagger.responses[401] = { 
          description: 'Não autorizado' 
        }  
        */
        const error = new Error("Current password incorrect.");
        error.statusCode = 401;
        throw error;
      }
      bcrypt
        .hash(newPassord, 12)
        .then((hashed_password) => {
          user.password = hashed_password;
          return user.save();
        })
        .then((result) => {
          res
            .status(200)
            .json({ message: "User password changed.", userId: result.id });
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

exports.getProfile = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/users/profile/{userId}'
    #swagger.tags = ['Users']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para buscar um usuário.'
    #swagger.parameters['userId'] = { description: 'ID do usuário.' } 
  */

  const userId = req.params.userId;
  User.scope("withoutPassword")
    .findByPk(userId)
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
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/user"   
          },
          description: 'Usuário buscado.' 
        }  
      */
      res.status(200).json({ message: "User fetched.", user: user });
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
