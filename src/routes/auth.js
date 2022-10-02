const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const middleAuth = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post(
  "/register",
  [body("password").trim().isLength({ min: 6 })],
  middleAuth.checkEmailAvailability,
  middleAuth.checkUsernameAvailability,
  middleAuth.checkCpfAvailability,
  authController.register
);

router.post("/login", authController.login);

module.exports = router;
