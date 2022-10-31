const Voter = require("../models/voter");

module.exports = {
  checkVoter: function (req, _res, next) {
    Voter.findOne({
      where: {
        pollId: req.body.pollId,
        activated: true,
        email: req.body.email,
      },
    })
      .then((voter) => {
        if (!voter) {
          next();
        } else {
          const error = new Error("Voter already added.");
          error.statusCode = 403;
          throw error;
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
};
