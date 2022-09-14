const User = require("../models/user");

exports.edit = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/users/edit/{userId}'
  // #swagger.tags = ['Users']
  // #swagger.method = 'put'
  // #swagger.description = 'Endpoint para editar um usuário.'
  // #swagger.parameters['userId'] = { description: 'ID do usuário.' }

  const userId = req.params.userId;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.status_code = 404;
        throw error;
      }
      if (user.id != req.userId) {
        const error = new Error("Forbidden.");
        error.status_code = 403;
        throw error;
      }
      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User updated.", user: result.id });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.getProfile = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/users/profile/{userId}'
  // #swagger.tags = ['Users']
  // #swagger.method = 'get'
  // #swagger.description = 'Endpoint para buscar um usuário.'
  // #swagger.parameters['userId'] = { description: 'ID do usuário.' }

  const userId = req.params.userId;
  User.scope("withoutPassword")
    .findByPk(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.status_code = 404;
        throw error;
      }
      res.status(200).json({ message: "User fetched.", user: user });
    })
    .catch((err) => {
      if (!err) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};
