const Poll = require("../models/poll");
const Question = require("../models/question");
const Option = require("../models/option");
const crypto = require("crypto");
const QuestionService = require("../services/questionService");

exports.getAllMyPolls = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/all'
    #swagger.tags = ['Polls']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para mostrar todas votações de um usuário.' 
  */
  Poll.findAll({ where: { userId: req.userId, activated: true } })
    .then((polls) => {
      if (!polls) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Poll"   
          },
          description: 'Votações buscadas.' 
        }  
      */
      res.status(200).json({ message: "Polls fetched.", polls: polls });
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

exports.getPollByUrl = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/getPoll/{sharing_url}'
    #swagger.tags = ['Polls']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para buscar uma votação a partir da url compartilhável.
    #swagger.parameters['sharing_url'] = { description: 'URL compartilhável da votação.' }  
  */
  const sharing_url = req.params.sharing_url;
  Poll.findOne({
    where: {
      sharing_url: sharing_url,
      activated: true,
    },
    include: {
      model: Question,
      as: "questions",
      where: {
        activated: true,
      },
      required: false,
      include: {
        model: Option,
        as: "options",
        where: {
          activated: true,
        },
        required: false,
      },
    },
  })
    .then((poll) => {
      if (!poll) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Poll"   
          },
          description: 'Votação buscada.' 
        }  
      */
      res.status(200).json({ message: "Poll fetched.", poll: poll });
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

exports.getPollById = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/getPoll/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para buscar uma votações.
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
    include: {
      model: Question,
      as: "questions",
      where: {
        activated: true,
      },
      required: false,
      include: {
        model: Option,
        as: "options",
        where: {
          activated: true,
        },
        required: false,
      },
    },
  })
    .then((polls) => {
      if (!polls) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Poll"   
          },
          description: 'Votação buscada.' 
        }  
      */
      res.status(200).json({ message: "Poll fetched.", polls: polls });
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

exports.createPoll = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/create'
    #swagger.tags = ['Polls']
    #swagger.method = 'post'
    #swagger.description = 'Endpoint para criar uma votação.'
    #swagger.parameters['poll'] = {
    in: 'body',
    description: 'Informações da votação.',
    required: true,
    schema: { 
      $ref: "#/definitions/Poll" 
    }
  } 
  */
  const title = req.body.title;
  const initial_date = req.body.initial_date;
  const end_date = req.body.end_date;
  const privacy = req.body.privacy;
  const description = req.body.description;
  const userId = req.body.userId;
  if (userId != req.userId) {
    /* 
      #swagger.responses[403] = { 
        description: 'Não autorizado' 
      }  
    */
    const error = new Error("Forbidden.");
    error.statusCode = 403;
    throw error;
  }
  Poll.create({
    title: title,
    initial_date: initial_date,
    end_date: end_date,
    privacy: privacy,
    description: description,
    userId: userId,
  })
    .then((result) => {
      /* 
        #swagger.responses[201] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação criado.' 
        }  
      */
      res
        .status(201)
        .json({ message: "Poll created successfully.", poll: result });
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

exports.editPoll = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/edit/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'put'
    #swagger.description = 'Endpoint para editar uma votação.'
    #swagger.parameters['poll'] = {
      in: 'body',
      description: 'Informações da votação.',
      required: true,
      schema: { 
        $ref: "#/definitions/Poll" 
      }
    }   
  */
  const pollId = req.params.pollId;
  const title = req.body.title;
  const initial_date = req.body.initial_date;
  const end_date = req.body.end_date;
  const privacy = req.body.privacy;
  const description = req.body.description;

  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not find.");
        error.statusCode = 404;
        throw error;
      }
      if (poll.started) {
        /* 
          #swagger.responses[422] = { 
          description: 'Não é possível editar uma votação iniciada.' 
        }  
        */
        const error = new Error("Can't edit already started polls.");
        error.statusCode = 422;
        throw error;
      }
      if (poll.userId != req.userId) {
        /* 
          #swagger.responses[403] = { 
            description: 'Não autorizado' 
          }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      poll.title = title;
      poll.initial_date = initial_date;
      poll.end_date = end_date;
      poll.privacy = privacy;
      poll.description = description;
      return poll.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação editado.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Poll edited successfully.", poll: result });
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

exports.deletePoll = (req, res, next) => {
  /*  #swagger.start
    #swagger.path = '/polls/delete/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'delete'
    #swagger.description = 'Endpoint para deletar uma votação.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not find.");
        error.statusCode = 404;
        throw error;
      }
      if (poll.userId != req.userId) {
        /* 
          #swagger.responses[403] = { 
            description: 'Não autorizado' 
          }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      try {
        QuestionService.deleteQuestionsOnCascade(poll.id);
      } catch (err) {
        const error = new Error("Could not delete this poll questions");
        error.statusCode = 400;
        throw error;
      }
      poll.activated = false;
      poll.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação deletado.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Poll deleted successfully.", poll: result });
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

exports.startPoll = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/start/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'patch'
    #swagger.description = 'Endpoint para abrir uma votação para votos.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const poll = req.poll;
  if (poll.initial_date < Date.now()) poll.initial_date = new Date();
  poll.started = true;
  if (poll.sharing_url == null) {
    poll.sharing_url = crypto
      .createHash("shake256", { outputLength: 4 })
      .update(poll.id + new Date())
      .digest("hex");
  }
  poll
    .save()
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação inciada.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Poll started successfully.", pollId: result.id });
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

exports.updateDates = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/start/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'patch'
    #swagger.description = 'Endpoint para abrir uma votação para votos.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const poll = req.poll;
  poll.initial_date = req.body.initial_date;
  poll.end_date = req.body.end_date;

  poll
    .save()
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Datas atualizadas.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Poll dates updated successfully", poll: result });
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

exports.generateURL = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/generate/url/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'patch'
    #swagger.description = 'Endpoint para abrir uma votação para votos.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not find.");
        error.statusCode = 404;
        throw error;
      }
      poll.sharing_url = crypto
        .createHash("shake256", { outputLength: 4 })
        .update(poll.id + new Date())
        .digest("hex");
      poll.save().then((result) => {
        /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação inciada.' 
        }  
      */
        console.log(result);
        res.status(200).json({
          message: "Sharing URL generated successfully.",
          url: result.sharing_url,
        });
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

exports.finishPoll = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/polls/finish/{pollId}'
    #swagger.tags = ['Polls']
    #swagger.method = 'patch'
    #swagger.description = 'Endpoint para fechar uma votação para votos.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const pollId = req.params.pollId;
  Poll.findOne({
    where: {
      id: pollId,
      activated: true,
    },
  })
    .then((poll) => {
      if (!poll) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Poll not find.");
        error.statusCode = 404;
        throw error;
      }
      if (poll.userId != req.userId) {
        /* 
          #swagger.responses[403] = { 
            description: 'Não autorizado' 
          }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      if (!poll.started) {
        /* 
          #swagger.responses[409] = { 
            description: 'Não é possível finalizar uma votação não iniciada.' 
          }  
        */
        const error = new Error("Poll not started yet.");
        error.statusCode = 409;
        throw error;
      }
      if (poll.finished) {
        /* 
          #swagger.responses[409] = { 
            description: 'Votação já finalizada.' 
          }  
        */
        const error = new Error("Poll already finished.");
        error.statusCode = 409;
        throw error;
      }
      poll.end_date = new Date();
      poll.finished = true;
      poll.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Poll" 
          }
          description: 'Votação finalizada.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Poll finished successfully.", poll: result });
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
