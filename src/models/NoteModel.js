const mongoose = require("mongoose");

const Note = mongoose.model("Note", {
  title: String,
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: String,
    default: Date.now,
  },
});

module.exports = Note;
