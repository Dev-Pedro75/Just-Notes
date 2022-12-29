const express = require("express");
const Router = express.Router();
const NoteController = require("../controllers/NoteController");
const authToken = require("../middlewares/authToken");

Router.get("/note/:id", authToken.authToken, NoteController.getNote);
Router.get("/notes", authToken.authToken, NoteController.getNotes);
Router.post("/note/create", authToken.authToken, NoteController.create);
Router.post("/note/edit/:id", authToken.authToken, NoteController.edit);
Router.post("/note/delete/:id", authToken.authToken, NoteController.delete);

module.exports = Router;
