const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  [body("password").trim().isLength({ min: 6 })],
  authController.register
);

router.post("/login", authController.login);

module.exports = router;
