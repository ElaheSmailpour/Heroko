const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    vorname: String,
    nachname: String,
    email: String,
    passwort: String,
    admin: Boolean,
  }
);

module.exports = mongoose.model("User", UserSchema);