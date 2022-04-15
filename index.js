const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");

const app = express();
app.use(formidableMiddleware());

mongoose.connect("mongodb://localhost:27017/vinted");

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

// Pour démarrer le serveur :
app.listen(3000, () => {
  console.log("Server started");
});
