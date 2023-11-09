const express = require("express");
const productController = require("../controllers/productController.js");
const authMiddleware = require('../middleware/authMiddleware');
  
const productRoutes = express.Router();
productRoutes.get("/getAll/:type?", productController.getAll);
productRoutes.get("/topRated", productController.topRated);
productRoutes.get("/topOffer", productController.topOffer);
productRoutes.post("/create", authMiddleware.adminAuth, productController.insertNew);
productRoutes.post("/addRating", authMiddleware.adminAuth, productController.addRating);
productRoutes.post("/addReview", authMiddleware.adminAuth, productController.addReview);

module.exports = productRoutes;