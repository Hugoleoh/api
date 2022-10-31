const Poll = require("../models/poll");
module.exports = {
  checkPollAvailability: function (req, _res, next) {
    try {
      if (!req.body.pollId) {
        const error = new Error("Invalid poll ID");
        error.statusCode = 422;
        throw error;
      }
      Poll.findOne({ where: { id: req.body.pollId } })
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
};
