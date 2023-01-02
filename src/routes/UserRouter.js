const express = require("express");
const Router = express.Router();
const UserController = require("../controllers/UserController");
const authToken = require("../middlewares/authToken");

Router.get("/", (req, res) => {
  res.redirect("/login");
});
//Router.get("/notes", authToken.authToken, UserController.getNotes);
Router.get("/login", UserController.getLogin);
Router.get("/register", UserController.getRegister);
Router.get("/profile", authToken.authToken, UserController.getProfile);
Router.post("/register", UserController.register);
Router.post("/login", UserController.login);
Router.post("/profile", authToken.authToken, UserController.editProfile);

module.exports = Router;
