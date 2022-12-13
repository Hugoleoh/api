const sequelize = require("../util/database");

const Option = require("../models/option");
const Question = require("../models/question");

exports.addVote = async (req, res, next) => {
  /* #swagger.start
    #swagger.path = '/vote/add'
    #swagger.tags = ['Votes']
    #swagger.method = 'post'
    #swagger.description = 'Endpoint para adicionar um voto a uma opção.'
    #swagger.parameters['poll'] = {
    in: 'body',
    description: 'Informações da votação.',
    required: true,
    schema: { 
      pollId: 1,
      email: email@email.com,
      voter_key: S5W1XP,
      optionId: 1
    } 
  */
  const optionId = req.body.optionId;
  const voter = req.voter;
  const weight = voter.vote_weight;
  optionId.forEach((id) => {
    sequelize.transaction(async (t) => {
      return Option.findOne({
        where: {
          id: id,
          activated: true,
        },
        include: Question,
        transaction: t,
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
          } else {
            if (option.question.pollId != req.body.pollId) {
              const error = new Error(
                "Selected option must belong to this poll"
              );
              error.statusCode = 428;
              throw error;
            } else {
              option.votes_count = option.votes_count + weight * 1;
              return option.save({ transaction: t });
            }
          }
        })
        .then(() => {
          voter.has_voted = true;
          voter.voted_at = Date.now();
          voter.save();
        })
        .then(() => {
          /* 
      #swagger.responses[201] = { 
          schema: { 
            $ref: "#/definitions/Question" 
        }
        description: 'Voto computado com sucesso.' 
        }  
        */
          res
            .status(201)
            .json({ message: "Voted successfully.", success: true });
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
    });
  });
  // #swagger.end
};
