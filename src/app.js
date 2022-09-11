const express = require("express");
const bodyParser = require("body-parser");

const database = require("./util/database");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH , DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const pollRoutes = require("./routes/poll");
app.use("/polls", pollRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/users", userRoutes);

(async () => {
  const Poll = require("./models/poll");
  const Option = require("./models/option");
  const Question = require("./models/question");
  const User = require("./models/user");
  const Vote = require("./models/vote");
  const Voter = require("./models/voter");

  Poll.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  User.hasMany(Poll);

  Question.belongsTo(Poll, { constraints: true, onDelete: "CASCADE" });
  Poll.hasMany(Question);

  Option.belongsTo(Question, { constraints: true, onDelete: "CASCADE" });
  Question.hasMany(Option);

  Voter.belongsTo(Poll, { constraints: true, onDelete: "CASCADE" });
  Poll.hasMany(Voter);

  Vote.belongsTo(Option, { constraints: true, onDelete: "CASCADE" });
  Option.hasMany(Vote);
  await database.sync({});
})();

app.listen(3000);
