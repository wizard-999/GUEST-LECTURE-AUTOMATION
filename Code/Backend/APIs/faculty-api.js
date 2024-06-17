const exp = require("express");
const facultyApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = require('../Middlewares/verifyToken');
let facultycollection;

// Get facultycollection from app
facultyApp.use((req, res, next) => {
  facultycollection = req.app.get("facultycollection");
  next();
});

// Faculty registration route
facultyApp.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const newFaculty = req.body;
    const dbFaculty = await facultycollection.findOne({ username: newFaculty.username });
    if (dbFaculty !== null) {
      res.send({ message: "Faculty already exists" });
    } else {
      const hashedPassword = await bcryptjs.hash(newFaculty.password, 6);
      newFaculty.password = hashedPassword;
      await facultycollection.insertOne(newFaculty);
      res.send({ message: "Faculty created" });
    }
  })
);

// Faculty login route
facultyApp.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const facultyCred = req.body;
    const dbFaculty = await facultycollection.findOne({ username: facultyCred.username });
    if (dbFaculty === null) {
      res.send({ message: "Invalid username" });
    } else {
      const status = await bcryptjs.compare(facultyCred.password, dbFaculty.password);
      if (status === false) {
        res.send({ message: "Invalid password" });
      } else {
        const signedToken = jwt.sign({ username: dbFaculty.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.send({ message: "login success", token: signedToken, user: dbFaculty });
      }
    }
  })
);
facultyApp.get(
  "/profile",
  verifyToken,
  expressAsyncHandler(async (req, res) => {
    const username = req.user.username;
    const facultyDetails = await facultycollection.findOne({ username });
    res.send({ message: "Profile data", data: facultyDetails });
  })
);


module.exports = facultyApp;
