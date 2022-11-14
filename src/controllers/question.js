const Question = require("../models/question");
const Option = require("../models/option");
const OptionService = require("../services/optionService");

exports.getMyPollQuestions = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/questions/{pollId}/all'
    #swagger.tags = ['Questions']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para mostrar todas questões de uma votação de um usuário.' 
  */
  const pollId = req.params.pollId;
  Question.findAll({
    where: { pollId: pollId, activated: true },
    include: {
      model: Option,
      as: "options",
      where: {
        activated: true,
      },
      required: false,
    },
  })
    .then((questions) => {
      if (!questions) {
        /* 
          #swagger.responses[404] = { 
          description: 'Questões não encontradas.' 
        }  
        */
        const error = new Error("Question not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Question"   
          },
          description: 'Questões buscadas.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Questions fetched.", questions: questions });
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

exports.getQuestion = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/questions/getQuestion/{questionId}'
    #swagger.tags = ['Questions']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para buscar uma questão.
    #swagger.parameters['questionId'] = { description: 'ID da questão.' }  
  */
  const questionId = req.params.questionId;
  Question.findOne({
    where: {
      id: questionId,
      activated: true,
    },
    include: {
      model: Option,
      as: "options",
      where: {
        activated: true,
      },
      required: false,
    },
  })
    .then((question) => {
      if (!question) {
        /* 
          #swagger.responses[404] = { 
          description: 'Questão não encontrada.' 
        }  
        */
        const error = new Error("Question not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Question"   
          },
          description: 'Questão buscada.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Question fetched.", question: question });
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

exports.createQuestion = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/questions/create'
    #swagger.tags = ['Questions']
    #swagger.method = 'post'
    #swagger.description = 'Endpoint para criar uma votação.'
    #swagger.parameters['question'] = {
    in: 'body',
    description: 'Informações da votação.',
    required: true,
    schema: { 
      $ref: "#/definitions/Question" 
    }
  } 
  */
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const pollId = req.body.pollId;
  Question.create({
    name: name,
    type: type,
    description: description,
    pollId: pollId,
  })
    .then((result) => {
      /* 
        #swagger.responses[201] = { 
          schema: { 
            $ref: "#/definitions/Question" 
          }
          description: 'Questão criada.' 
        }  
      */
      res
        .status(201)
        .json({ message: "Question created successfully.", question: result });
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

exports.editQuestion = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/questions/edit/{questionId}'
    #swagger.tags = ['Questions']
    #swagger.method = 'put'
    #swagger.description = 'Endpoint para editar uma Questão.'
    #swagger.parameters['question'] = {
      in: 'body',
      description: 'Informações da Questão.',
      required: true,
      schema: { 
        $ref: "#/definitions/Question" 
      }
    }   
  */
  const questionId = req.params.questionId;
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const pollId = req.body.pollId;
  Question.findOne({
    where: {
      id: questionId,
      activated: true,
    },
  })
    .then((question) => {
      if (!question) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Question not find.");
        error.statusCode = 404;
        throw error;
      }
      if (question.pollId != pollId) {
        /* 
          #swagger.responses[403] = { 
            description: 'Não autorizado' 
          }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      question.name = name;
      question.type = type;
      question.description = description;
      return question.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Question" 
          }
          description: 'Questão editado.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Question edited successfully.", question: result });
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

exports.deleteQuestion = (req, res, next) => {
  /*  #swagger.start
    #swagger.path = '/questions/delete/{questionId}'
    #swagger.tags = ['Questions']
    #swagger.method = 'delete'
    #swagger.description = 'Endpoint para deletar uma questão.' 
    #swagger.parameters['questionId'] = { description: 'ID da questão.' }  
  */
  const questionId = req.params.questionId;
  Question.findOne({
    where: {
      id: questionId,
      activated: true,
    },
  })
    .then((question) => {
      if (!question) {
        /* 
          #swagger.responses[404] = { 
          description: 'Questão não encontrada.' 
        }  
        */
        const error = new Error("Question not find.");
        error.statusCode = 404;
        throw error;
      }
      question.activated = false;
      try {
        OptionService.deleteOptionsOnCascade(question.id);
      } catch (err) {
        const error = new Error("Could not delete this question options");
        error.statusCode = 400;
        throw error;
      }
      question.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Question" 
          }
          description: 'Questão deletado.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Question deleted successfully.", question: result });
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
