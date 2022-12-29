require("dotenv").config();
const NoteModel = require("../models/NoteModel");
const UserController = require("../controllers/UserController");
const jwt = require("jsonwebtoken");

module.exports = {
  create: async (req, res) => {
    const { title } = req.body;
    if (!title) return res.send("sem title");

    const newNote = new NoteModel({
      title: title,
      description: "",
      author: req.id,
    });

    try {
      await newNote.save();

      return res.redirect(`/note/${newNote.id}`);
    } catch (error) {
      return res.json({ error: error });
    }
  },
  getUserToken: async (req, res) => {
    if (!req.headers.cookie) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
    } else {
      const token = req.headers.cookie.split("=")[1];
      const secret = process.env.SECRET;
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          res.status(401).json({ error: "Unauthorized: token invalid" });
        } else {
          await UserModel.findOne({ email: decoded.email })
            .exec()
            .then((user) => {
              return user;
            })
            .catch((err) => {
              res.status(401).json({ error: err });
            });
        }
      });
    }
  },
  edit: async (req, res) => {
    const { title, description } = req.body;
    console.log(title, description, "poooooooooo");

    await NoteModel.updateOne(
      { _id: req.params.id },
      {
        title: title,
        description: description,
        updated_at: Date.now(),
      }
    );
    res.status(200).json({ msg: "note edited" });
  },
  delete: async (req, res) => {
    await NoteModel.deleteOne({ _id: req.params.id });

    res.redirect("/user");
  },
  getNote: async (req, res) => {
    const note = await NoteModel.findOne({ _id: req.params.id }).exec();
    const user = await UserController.getUser(req.id);
    let notes = await NoteModel.find().exec();
    notes = notes.filter((note) => note.author == req.id);
    notes = notes.sort(function (a, b) {
      if (a.updated_at < b.updated_at) {
        return 1;
      }
      if (a.updated_at > b.updated_at) {
        return -1;
      }
      return 0;
    });

    return res.render("note", { user: user, note: note, notes: notes });
  },
  getNotes: async (req, res) => {
    const user = await UserController.getUser(req.id);
    const formater = Intl.DateTimeFormat("en", { dateStyle: "long" });
    let notes = await NoteModel.find().exec();

    notes = notes.filter((note) => note.author == req.id);
    notes = notes.sort(function (a, b) {
      if (a.updated_at < b.updated_at) {
        return 1;
      } else if (a.updated_at > b.updated_at) {
        return -1;
      }
      return 0;
    });
    notes.forEach((note) => {
      dateFormat = new Date(Number(note.updated_at));
      note.updated_at = formater.format(dateFormat);
    });
    return res.render("notes", { user: user, notes: notes });
  },
};
