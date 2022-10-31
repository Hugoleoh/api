const Voter = require("../models/voter");
const crypto = require("crypto");

exports.getMyPollVoters = (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/voters/{pollId}'
    #swagger.tags = ['Voters']
    #swagger.method = 'get'
    #swagger.description = 'Endpoint para mostrar todos votantes de uma votação de um usuário.' 
    #swagger.parameters['pollId'] = { description: 'ID da votação.' }  
  */
  const pollId = req.params.pollId;
  Voter.findAll({
    where: { pollId: pollId, activated: true },
  })
    .then((voters) => {
      if (!voters) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votantes não encontrados.' 
        }  
        */
        const error = new Error("Voters not found.");
        error.statusCode = 404;
        throw error;
      }
      /* 
          #swagger.responses[200] = { 
          schema: {
           $ref: "#/definitions/Voter"   
          },
          description: 'Votantes buscados.' 
        }  
      */
      res.status(200).json({ message: "Voters fetched.", voters: voters });
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

exports.addVoter = (req, res, next) => {
  /*  #swagger.start
  #swagger.path = '/voters/add'
  #swagger.tags = ['Voters']
  #swagger.method = 'post'
  #swagger.description = 'Endpoint para adicionar um votante.'

  #swagger.parameters['voter'] = {
    in: 'body',
    description: 'Informações da votação.',
    required: true,
    schema: { 
      $ref: "#/definitions/Voter" 
    }
  } 
  */
  const name = req.body.name;
  const email = req.body.email;
  const vote_weight = req.body.vote_weight;
  const voter_key = crypto
    .createHash("shake256", { outputLength: 4 })
    .update(email)
    .digest("hex")
    .toUpperCase();
  const pollId = req.body.pollId;
  Voter.create({
    name: name,
    email: email,
    vote_weight: vote_weight,
    voter_key: voter_key,
    pollId: pollId,
  })
    .then((result) => {
      /* 
        #swagger.responses[201] = { 
          schema: { 
            $ref: "#/definitions/Voter" 
          }
          description: 'Votante adicionado.' 
        }  
      */
      res
        .status(201)
        .json({ message: "Voter added successfully.", voter: result });
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
  // #swagger.end;
};

exports.removeVoter = (req, res, next) => {
  /*  #swagger.start
    #swagger.path = '/voters/remove/{voterId}'
    #swagger.tags = ['Voters']
    #swagger.method = 'delete'
    #swagger.description = 'Endpoint para remvover um votante.' 
    #swagger.parameters['voterId'] = { description: 'ID do votante.' }  
    */
  const voterId = req.params.voterId;
  Voter.findOne({
    where: {
      id: voterId,
      activated: true,
    },
  })
    .then((voter) => {
      if (!voter) {
        /* 
          #swagger.responses[404] = { 
          description: 'Votante não encontrado.' 
        }  
        */
        const error = new Error("Voter not find.");
        error.statusCode = 404;
        throw error;
      }
      voter.activated = false;
      voter.save();
    })
    .then((result) => {
      /* 
        #swagger.responses[200] = { 
          schema: { 
            $ref: "#/definitions/Voter" 
          }
          description: 'Votante removido.' 
        }  
      */
      res
        .status(200)
        .json({ message: "Voter removed successfully.", voter: result });
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
