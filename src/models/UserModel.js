const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User;
