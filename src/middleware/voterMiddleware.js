const Voter = require("../models/voter");
const { PRIVATE, PUBLIC } = require("../constants/poll-privacy");
const crypto = require("crypto");

module.exports = {
  checkAddVoter: function (req, _res, next) {
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
          error.statusCode = 409;
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
  checkVoter: function (req, _res, next) {
    Voter.findOne({
      where: {
        pollId: req.body.pollId,
        activated: true,
        email: req.body.email,
      },
    })
      .then(async (voter) => {
        switch (req.poll.privacy) {
          case PRIVATE:
            if (voter && !voter.has_voted) {
              req.voter = voter;
              next();
            } else {
              const error = new Error("Voter not allowed or already voted.");
              error.statusCode = 403;
              throw error;
            }
            break;
          case PUBLIC:
            if (!voter || (voter && !voter.has_voted)) {
              // Technical debt
              const name = req.body.name;
              const email = req.body.email;
              const voter_key = crypto
                .createHash("shake256", { outputLength: 4 })
                .update(email + req.poll.id)
                .digest("hex")
                .toUpperCase();
              const pollId = req.poll.id;
              const voter = await Voter.create({
                name: name,
                email: email,
                voter_key: voter_key,
                pollId: pollId,
              });
              req.voter = voter;
              next();
            } else {
              const error = new Error("Voter not allowed or already voted.");
              error.statusCode = 403;
              throw error;
            }
            break;
        }
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  checkVoterKey: function (req, _res, next) {
    if (req.poll.privacy == PRIVATE) {
      try {
        if (req.voter.voter_key != req.body.voter_key) {
          const error = new Error("Voter Key does not check.");
          error.statusCode = 403;
          throw error;
        } else {
          next();
        }
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  },
};
