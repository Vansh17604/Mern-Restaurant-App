const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const Routes = require('./routes/route');
const path = require('path');


const app = express();
dotenv.config();
app.use(cors({
  origin: process.env.FRONTEND_URL,
      credentials: true,

}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use('/', Routes);
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));



mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection failed");
  });

  
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
