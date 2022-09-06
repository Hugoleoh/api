const express = require("express");

const pollController = require("../controllers/poll");

const router = express.Router();

router.get("/all", pollController.getAllMyPolls);

router.post("/create", pollController.createPoll);

module.exports = router;
