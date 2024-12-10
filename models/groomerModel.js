const mongoose = require("mongoose");

const groomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  services: {
    type: [String],
    required: true
  },
  petTypes: {
    type: [String],
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("groomers", groomerSchema); 