require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

module.exports = {
  authToken: async (req, res, next) => {
    if (!req.headers.cookie) {
      res.redirect("/login");
    } else {
      const token = req.headers.cookie.split("=")[1];
      const secret = process.env.SECRET;
      jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
          res.redirect("/login");
        } else {
          req.email = decoded.email;
          await UserModel.findOne({ email: decoded.email })
            .exec()
            .then((user) => {
              req.id = user.id;
              next();
            })
            .catch((err) => {
              res.status(401).json({ error: err });
            });
        }
      });
    }
  },
};
