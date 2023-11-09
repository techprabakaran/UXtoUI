const express = require("express");
const bannerController = require("../controllers/bannerController.js");
const authMiddleware = require('../middleware/authMiddleware');
  
const bannerRoutes = express.Router();
bannerRoutes.get("/getAll", bannerController.getAll);
bannerRoutes.post("/create", authMiddleware.adminAuth, bannerController.insertNew);

module.exports = bannerRoutes;