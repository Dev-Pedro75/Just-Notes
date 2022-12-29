require("dotenv").config();
const express = require("express");
const app = express();
const UserRouter = require("./src/routes/UserRouter");
const NoteRouter = require("./src/routes/NoteRouter");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "/src/public")));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(UserRouter, NoteRouter);

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGODB_PORT)
  .then(() => {
    console.log("Mongodb connected!");
  })
  .catch((err) => {
    console.error("Mongodb error : " + err);
  });

app.listen(PORT, () => console.log(`Running localhost:${PORT}...`));
