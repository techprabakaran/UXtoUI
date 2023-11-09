// const mongoose = "./config/db.js";
const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    confirm_password: {
        type: String,
        required: true,
        min: 5,
      },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
