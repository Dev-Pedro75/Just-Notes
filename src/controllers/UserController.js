require("dotenv").config();
const UserModel = require("../models/UserModel");
const NoteModel = require("../models/NoteModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUser(id) {
  const user = await UserModel.findOne({ _id: id }).exec();

  return user;
}

module.exports = {
  register: async (req, res) => {
    const { username, email, password } = req.body;

    if (!email) {
      return res.render("register", {
        status: {
          Error: true,
          Exists: false,
        },
      });
    }
    if (!password) {
      return res.render("register", {
        status: {
          Error: true,
          Exists: false,
        },
      });
    }
    if (!username) {
      return res.render("register", {
        status: {
          Error: true,
          Exists: false,
        },
      });
    }

    try {
      const userExists = await UserModel.findOne({ email: email }).exec();
      if (userExists) {
        return res.render("register", {
          status: {
            Error: false,
            Exists: true,
          },
        });
      }

      const salt = await bcrypt.genSalt(15);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = new UserModel({
        username,
        email,
        password: passwordHash,
      });

      await newUser.save();
      return res.render("login");
    } catch (error) {
      return res.json({ error: "Error on Register" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res.render("login", {
        status: {
          Error: true,
        },
      });
    }
    if (!password) {
      return res.render("login", {
        status: {
          Error: true,
        },
      });
    }

    try {
      const user = await UserModel.findOne({ email: email }).exec();

      if (!user) {
        return res.render("login", {
          status: {
            Error: true,
          },
        });
      } else {
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
          return res.render("login", {
            status: {
              Error: true,
            },
          });
        } else {
          const secret = process.env.SECRET;
          const token = jwt.sign({ email: user.email }, secret, {
            expiresIn: "1d",
          });
          res.cookie("token", token, {
            maxAge: 3600000000,
            httpOnly: false,
          });
          res.redirect("/notes");
        }
      }
    } catch (error) {
      res.status(400).json({ error: "error on login" });
    }
  },
  getUser: async (id) => {
    const user = await UserModel.findOne({ _id: id }).exec();

    return user;
  },
  editProfile: async (req, res) => {
    let user = await UserModel.findOne({ _id: req.id }).exec();
    const { username } = req.body;

    await UserModel.updateOne(
      { _id: req.id },
      {
        $set: {
          username: username || user.username,
        },
      }
    );
    user = await UserModel.findOne({ _id: req.id }).exec();
    res.render("profile", { user: user });
  },
  getLogin: async (req, res) => {
    if (!req.headers.cookie) {
      res.render("login", {
        status: {
          Error: false,
        },
      });
    } else {
      const token = req.headers.cookie.split("=")[1];
      const secret = process.env.SECRET;
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          res.render("login", {
            status: {
              Error: true,
            },
          });
        } else {
          req.email = decoded.email;
          await UserModel.findOne({ email: decoded.email })
            .exec()
            .then((user) => {
              res.redirect("/notes");
            })
            .catch((err) => {
              res.status(401).json({ error: err });
            });
        }
      });
    }
  },
  getProfile: async (req, res) => {
    const user = await getUser(req.id);

    res.render("profile", { user });
  },
  /* getNotes: async (req, res) => {
    const user = await getUser(req.id);
    let notes = await NoteModel.find().exec();
    const formater = Intl.DateTimeFormat("en", { dateStyle: "long" });
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

    notes.forEach((note) => {
      dateFormat = new Date(Number(note.updated_at));

      note.updated_at = formater.format(dateFormat);
    });

    //res.send(notes);
    return res.render("notes", { user: user, notes: notes });
  }, */
  getRegister: async (req, res) => {
    res.render("register", {
      status: {
        Error: false,
        Exists: false,
      },
    });
  },
};
