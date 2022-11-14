const express = require("express");

const voteController = require("../controllers/vote");

const router = express.Router();

const middlePoll = require("../middleware/pollMiddleware.js");
const middleVoter = require("../middleware/voterMiddleware.js");

router.post(
  "/addVote",
  middlePoll.checkVoteAvailability,
  middleVoter.checkVoter,
  middleVoter.checkVoterKey,
  voteController.addVote
);

module.exports = router;
