const express = require("express");

const optionController = require("../controllers/option");

const router = express.Router();

const isAuth = require("../middleware/is-auth");
const middlePoll = require("../middleware/pollMiddleware.js");

router.get("/:questionId/all", isAuth, optionController.getMyQuestionOptions);

router.get("/getOption/:optionId", isAuth, optionController.getOption);

router.post(
  "/create",
  isAuth,
  middlePoll.checkPollAvailability,
  optionController.createOption
);

router.put(
  "/edit/:optionId",
  isAuth,
  middlePoll.checkPollAvailability,
  optionController.editOption
);

router.delete(
  "/delete/:optionId",
  isAuth,
  middlePoll.checkPollAvailability,
  optionController.deleteOption
);

module.exports = router;
