const Poll = require("../models/poll");

exports.getAllMyPolls = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/all'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'get'
  // #swagger.description = 'Endpoint para mostrar todas votações de um usuário.'
  Poll.findAll({ where: { userId: req.userId, activated: true } })
    .then((polls) => {
      if (!polls) {
        const error = new Error("Poll not found.");
        error.status_code = 404;
        throw error;
      }
      res.status(200).json({ message: "Polls fetched.", polls: polls });
    })
    .catch((err) => {
      if (!err) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.getPoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/getPoll/{pollId}'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'get'
  // #swagger.description = 'Endpoint para buscar uma votações.
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((polls) => {
      if (!polls) {
        const error = new Error("Poll not found.");
        error.status_code = 404;
        throw error;
      }
      res.status(200).json({ message: "Polls fetched.", polls: polls });
    })
    .catch((err) => {
      if (!err) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.createPoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/create'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'post'
  // #swagger.description = 'Endpoint para criar uma votação.'
  const title = req.body.title;
  const initial_date = req.body.initial_date;
  const end_date = req.body.end_date;
  const description = req.body.description;
  const userId = req.body.userId;
  if (userId != req.userId) {
    const error = new Error("Forbidden.");
    error.status_code = 403;
    throw error;
  }
  Poll.create({
    title: title,
    initial_date: initial_date,
    end_date: end_date,
    description: description,
    userId: userId,
  })
    .then((result) => {
      res
        .status(201)
        .json({ message: "Poll created successfully.", poll: result });
    })
    .catch((err) => {
      if (!err) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.editPoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/edit/{pollId}'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'put'
  // #swagger.description = 'Endpoint para editar uma votação.'
  const pollId = req.params.pollId;
  const title = req.body.title;
  const initial_date = req.body.initial_date;
  const end_date = req.body.end_date;
  const description = req.body.description;

  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        const error = new Error("Poll not find.");
        error.status_code = 404;
        throw error;
      }
      if (poll.started) {
        const error = new Error("Can't edit already started polls.");
        error.status_code = 422;
        throw error;
      }
      if (poll.userId != req.userId) {
        const error = new Error("Forbidden.");
        error.status_code = 403;
        throw error;
      }
      poll.title = title;
      poll.initial_date = initial_date;
      poll.end_date = end_date;
      poll.description = description;
      return poll.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Poll created successfully.", poll: result });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.deletePoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/delete/{pollId}'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'delete'
  // #swagger.description = 'Endpoint para deletar uma votação.'
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        const error = new Error("Poll not find.");
        error.status_code = 404;
        throw error;
      }
      if (poll.userId != req.userId) {
        const error = new Error("Forbidden.");
        error.status_code = 403;
        throw error;
      }
      poll.activated = false;
      poll.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Poll deleted successfully.", poll: result });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.startPoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/start/{pollId}'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'patch'
  // #swagger.description = 'Endpoint para abrir uma votação para votos.'
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        const error = new Error("Poll not find.");
        error.status_code = 404;
        throw error;
      }
      if (poll.userId != req.userId) {
        const error = new Error("Forbidden.");
        error.status_code = 403;
        throw error;
      }
      if (poll.started || poll.finished) {
        const error = new Error("Cannot start a poll in progress or finished.");
        error.status_code = 422;
        throw error;
      }
      poll.initial_date = new Date();
      poll.started = true;
      poll.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Poll started successfully.", poll: result });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};

exports.finishPoll = (req, res, next) => {
  // #swagger.start
  // #swagger.path = '/polls/finish/{pollId}'
  // #swagger.tags = ['Polls']
  // #swagger.method = 'patch'
  // #swagger.description = 'Endpoint para fechar uma votação para votos.'
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        const error = new Error("Poll not find.");
        error.status_code = 404;
        throw error;
      }
      if (poll.userId != req.userId) {
        const error = new Error("Forbidden.");
        error.status_code = 403;
        throw error;
      }
      if (!poll.started || poll.finished) {
        const error = new Error("Cannot start a poll in progress or finished.");
        error.status_code = 422;
        throw error;
      }
      poll.end_date = new Date();
      poll.finished = true;
      poll.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Poll finished successfully.", poll: result });
    })
    .catch((err) => {
      if (!err.status_code) {
        err.status_code = 500;
      }
      next(err);
    });
  // #swagger.end
};
