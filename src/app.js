const express = require("express");
const bodyParser = require("body-parser");

const swaggerUI = require("swagger-ui-express"),
  swaggerDocument = require("../swagger_output.json");

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

const questionRoutes = require("./routes/question");
app.use("/questions", questionRoutes);

const optionRoutes = require("./routes/option");
app.use("/options", optionRoutes);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const userRoutes = require("./routes/user");
app.use("/users", userRoutes);

const voterRoutes = require("./routes/voter");
app.use("/voters", voterRoutes);

(async () => {
  const Poll = require("./models/poll");
  const Option = require("./models/option");
  const Question = require("./models/question");
  const User = require("./models/user");
  const WriteInAnswer = require("./models/writeInAnswer");
  const Voter = require("./models/voter");

  Poll.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
  User.hasMany(Poll);

  Question.belongsTo(Poll, { constraints: true, onDelete: "CASCADE" });
  Poll.hasMany(Question);

  Option.belongsTo(Question, { constraints: true, onDelete: "CASCADE" });
  Question.hasMany(Option);

  Voter.belongsTo(Poll, { constraints: true, onDelete: "CASCADE" });
  Poll.hasMany(Voter);

  WriteInAnswer.belongsTo(Option, { constraints: true, onDelete: "CASCADE" });
  Option.hasMany(WriteInAnswer);
  await database.sync({});
})();

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use((error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({ message: error.message || "Internal server error" });
});

app.listen(3000);
