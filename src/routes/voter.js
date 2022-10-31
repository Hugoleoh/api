const express = require("express");

const voterController = require("../controllers/voter");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const middlePoll = require("../middleware/pollMiddleware.js");
const middleVoter = require("../middleware/voterMiddleware.js");

router.get("/:pollId", isAuth, voterController.getMyPollVoters);

router.post(
  "/add",
  isAuth,
  middlePoll.checkPollAvailability,
  middleVoter.checkVoter,
  voterController.addVoter
);

router.delete(
  "/remove/:voterId",
  isAuth,
  middlePoll.checkPollAvailability,
  voterController.removeVoter
);

module.exports = router;
