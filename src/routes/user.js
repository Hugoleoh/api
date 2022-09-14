const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/user");

const router = express.Router();

router.put(
  "/edit/:userId",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((found_user) => {
          if (found_user) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("username")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((found_user) => {
          if (found_user) {
            return Promise.reject("username already exists!");
          }
        });
      }),
  ],
  isAuth,
  userController.edit
);

router.get("/profile/:userId", isAuth, userController.getProfile);

module.exports = router;
