const express = require("express");

const questionController = require("../controllers/question");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const middlePoll = require("../middleware/pollMiddleware.js");

router.get("/:pollId/all", isAuth, questionController.getMyPollQuestions);

router.get("/getQuestion/:questionId", isAuth, questionController.getQuestion);

router.post(
  "/create",
  isAuth,
  middlePoll.checkPollAvailability,
  questionController.createQuestion
);

router.put(
  "/edit/:questionId",
  isAuth,
  middlePoll.checkPollAvailability,
  questionController.editQuestion
);

router.delete(
  "/delete/:questionId",
  isAuth,
  middlePoll.checkPollAvailability,
  questionController.deleteQuestion
);

module.exports = router;
