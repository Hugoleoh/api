const express = require("express");

const pollController = require("../controllers/poll");

const router = express.Router();

const middlePoll = require("../middleware/pollMiddleware.js");
const isAuth = require("../middleware/is-auth");

router.get("/all", isAuth, pollController.getAllMyPolls);

router.get("/getPoll/:pollId", pollController.getPollById);

router.get("/getPollByUrl/:sharing_url", pollController.getPollByUrl);

router.post("/create", isAuth, pollController.createPoll);

router.put(
  "/edit/:pollId",
  middlePoll.checkPollAvailability,
  isAuth,
  pollController.editPoll
);

router.delete(
  "/delete/:pollId",
  isAuth,
  middlePoll.checkPollAvailability,
  pollController.deletePoll
);

router.patch(
  "/start/:pollId",
  isAuth,
  middlePoll.checkPollStartConditions,
  pollController.startPoll
);

router.patch("/finish/:pollId", isAuth, pollController.finishPoll);

router.patch("/generate/url/:pollId", isAuth, pollController.generateURL);

module.exports = router;
