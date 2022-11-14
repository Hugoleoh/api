const Poll = require("../models/poll");
const Question = require("../models/question");
const Option = require("../models/option");
module.exports = {
  checkPollAvailability: function (req, _res, next) {
    try {
      if (!req.body.pollId) {
        const error = new Error("Invalid poll ID");
        error.statusCode = 422;
        throw error;
      }
      Poll.findOne({ where: { id: req.body.pollId, activated: true } })
        .then((poll) => {
          if (!poll) {
            const error = new Error("Poll does not exist.");
            error.statusCode = 404;
            throw error;
          } else if (poll.started || poll.userId != req.userId) {
            const error = new Error("Poll not available");
            error.statusCode = 403;
            throw error;
          } else {
            next();
          }
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  checkVoteAvailability: function (req, _res, next) {
    try {
      if (!req.body.pollId) {
        const error = new Error("Invalid poll ID");
        error.statusCode = 422;
        throw error;
      }
      Poll.findOne({
        where: { id: req.body.pollId, activated: true },
      })
        .then((poll) => {
          if (!poll) {
            const error = new Error("Poll does not exist.");
            error.statusCode = 404;
            throw error;
          } else if (!poll.started || (poll.started && poll.finished)) {
            const error = new Error("Poll not available");
            error.statusCode = 403;
            throw error;
          } else {
            req.poll = poll;
            next();
          }
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    } catch (err) {
      next(err);
    }
  },
  checkPollStartConditions: function (req, _res, next) {
    Poll.findOne({
      where: {
        id: req.params.pollId,
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
          const error = new Error("Poll not found.");
          error.statusCode = 404;
          throw error;
        } else {
          if (poll.started) {
            const error = new Error("Poll already started.");
            error.statusCode = 409;
            throw error;
          }
          if (poll.questions.length > 0) {
            poll.questions.forEach((question) => {
              if (question.options.length < 1) {
                const error = new Error(
                  "A poll question has to have at least one option."
                );
                error.statusCode = 428;
                throw error;
              }
            });
            req.poll = poll;
            next();
          } else {
            const error = new Error(
              "A poll has to have at least one question."
            );
            error.statusCode = 428;
            throw error;
          }
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
