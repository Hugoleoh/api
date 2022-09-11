const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = (req, res, next) => {
  const header = req.get("Authorization");
  if (!header) {
    const error = new Error("No headers in request");
    error.status_code = 401;
    throw error;
  }
  const token = header.split(" ")[1];
  let decoded_token;
  try {
    decoded_token = jwt.verify(token, bcrypt.hashSync("PollarAPI", 12));
  } catch (err) {
    err.status_code = 500;
    throw err;
  }
  if (!decoded_token) {
    const error = new Error("Not authenticated.");
    error.status_code = 401;
    throw error;
  }
  req.userId = decoded_token.userId;
  next();
};
