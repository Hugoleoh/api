const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    const error = new Error("No headers in request");
    error.statusCode = 401;
    throw error;
  }
  const token = header.split(" ")[1];
  let decoded_token;
  try {
    decoded_token = jwt.verify(
      token,
      "1b93823c3837425690b259976639b5753644ca67"
    );
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decoded_token) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decoded_token.userId;
  next();
};
