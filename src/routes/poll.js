const express = require("express");

const pollController = require("../controllers/poll");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/all", isAuth, pollController.getAllMyPolls);

router.get("/getPoll/:pollId", pollController.getPoll);

router.post("/create", isAuth, pollController.createPoll);

router.put("/edit/:pollId", isAuth, pollController.editPoll);

router.delete("/delete/:pollId", isAuth, pollController.deletePoll);

router.patch("/start/:pollId", isAuth, pollController.startPoll);

router.patch("/finish/:pollId", isAuth, pollController.finishPoll);

module.exports = router;
