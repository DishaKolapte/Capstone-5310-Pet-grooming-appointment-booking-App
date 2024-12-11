const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isGroomer: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: [true, "phone is required"],
  },
  city: {
    type: String,
    required: false,
    default: "",
  },
  address: {
    type: String,
    required: false,
    default: "",
  },
  notification: {
    type: Array,
    default: [],
  }
});

module.exports = mongoose.model("users", userSchema);