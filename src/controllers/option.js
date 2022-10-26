const Option = require("../models/option");

exports.getMyQuestionOptions = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/options/{questionId}/all'
    #swagger.tags = ['Options']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para mostrar todas opções de uma questão de um usuário.' 
  */
  const questionId = req.params.questionId;
  Option.findAll({
    where: { questionId: questionId, activated: true },
  })
    .then((options) => {
      if (!options) {
        /* 
          #swagger.responses[404] = { 
          description: 'Opções não encontradas.' 
        }  
        */
        const error = new Error("Options not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/option"   
          },
          description: 'Opções buscadas.' 
        }  
      */
      res.status(200).json({ message: "Options fetched.", options: options });
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

exports.getOption = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/options/getOption/{optionId}'
    #swagger.tags = ['Options']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para buscar uma questão.
    #swagger.parameters['optionId'] = { description: 'ID da questão.' }  
  */
  const optionId = req.params.optionId;
  Option.findOne({
    where: {
      id: optionId,
      activated: true,
    },
  })
    .then((option) => {
      if (!option) {
        /* 
          #swagger.responses[404] = { 
          description: 'Questão não encontrada.' 
        }  
        */
        const error = new Error("Option not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/option"   
          },
          description: 'Opção buscada.' 
        }  
      */
      res.status(200).json({ message: "Option fetched.", option: option });
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

exports.createOption = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/options/create'
    #swagger.tags = ['Options']
    #swagger.method = 'post'
    #swagger.description = 'Endpoint para criar uma opção de uma questão.'
    #swagger.parameters['option'] = {
    in: 'body',
    description: 'Informações da questão.',
    required: true,
    schema: { 
      $ref: "#/definitions/option" 
    }
  } 
  */
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const questionId = req.body.questionId;
  Option.create({
    name: name,
    type: type,
    description: description,
    questionId: questionId,
  })
    .then((result) => {
      /* 
        #swagger.responses[201] = { 
          schema: { 
            $ref: "#/definitions/option" 
          }
          description: 'Opção criada.' 
        }  
      */
      res
        .status(201)
        .json({ message: "Option created successfully.", option: result });
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

exports.editOption = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/options/edit/{optionId}'
    #swagger.tags = ['Options']
    #swagger.method = 'put'
    #swagger.description = 'Endpoint para editar uma Opção de uma questão.'
    #swagger.parameters['option'] = {
      in: 'body',
      description: 'Informações da Opção.',
      required: true,
      schema: { 
        $ref: "#/definitions/option" 
      }
    }   
  */
  const optionId = req.params.optionId;
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const questionId = req.body.questionId;
  Option.findOne({
    where: {
      id: optionId,
      activated: true,
    },
  })
    .then((option) => {
      if (!option) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votação não encontrada.' 
        }  
        */
        const error = new Error("Option not find.");
        error.statusCode = 404;
        throw error;
      }
      if (option.questionId != questionId) {
        /* 
          #swagger.responses[403] = { 
            description: 'Não autorizado' 
          }  
        */
        const error = new Error("Forbidden.");
        error.statusCode = 403;
        throw error;
      }
      option.name = name;
      option.type = type;
      option.description = description;
      return option.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/option" 
          }
          description: 'Opção editada.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Option edited successfully.", option: result });
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

exports.deleteOption = (req, res, next) => {
  /*  #swagger.start
    #swagger.path = '/options/delete/{optionId}'
    #swagger.tags = ['Options']
    #swagger.method = 'delete'
    #swagger.description = 'Endpoint para deletar uma opção de uma questão.' 
    #swagger.parameters['optionId'] = { description: 'ID da opção.' }  
  */
  const optionId = req.params.optionId;
  Option.findOne({
    where: {
      id: optionId,
      activated: true,
    },
  })
    .then((option) => {
      if (!option) {
        /* 
          #swagger.responses[404] = { 
          description: 'Opção não encontrada.' 
        }  
        */
        const error = new Error("Option not find.");
        error.statusCode = 404;
        throw error;
      }
      option.activated = false;
      option.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/option" 
          }
          description: 'Opção deletada.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Option deleted successfully.", option: result });
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
