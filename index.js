const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require("dotenv"); 
const adminRoutes = require("./routes/admin.js");
const bannerRoutes = require("./routes/banner.js");
const productRoutes = require("./routes/product.js");
const connectDB = require('./config/db.js');

// data imports

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(cors());

const port = process.env.SERVER_PORT;

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Welcome to UXtoUI...!!");
});

app.use("/admin", adminRoutes);
app.use("/banner", bannerRoutes);
app.use("/product", productRoutes);

/* SERVER SETUP */
(async() =>{
  connectDB().then((status) =>{
    if(status){
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    else {
      console.log("Unable to start server");
    }
  })
})()