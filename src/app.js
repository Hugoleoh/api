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

(async () => {
   const Poll = require('./models/poll');
   await database.sync();
})();

app.listen(3000);
