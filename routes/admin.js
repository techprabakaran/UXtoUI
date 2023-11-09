const express = require("express");
const adminController = require("../controllers/adminController.js");
  
const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.loginAdmin);
adminRoutes.post("/registration", adminController.registerAdmin);

module.exports = adminRoutes;