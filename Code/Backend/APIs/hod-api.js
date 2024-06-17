const exp = require('express');
const hodApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Middlewares/verifyToken');

let hodscollection;

// Get hodscollection from app
hodApp.use((req, res, next) => {
    hodscollection = req.app.get('hodscollection');
    next();
});

// HOD registration route
hodApp.post('/register', expressAsyncHandler(async (req, res) => {
    const newHod = req.body;
    const dbHod = await hodscollection.findOne({ username: newHod.username });
    if (dbHod !== null) {
        res.send({ message: "HOD already exists" });
    } else {
        const hashedPassword = await bcryptjs.hash(newHod.password, 6);
        newHod.password = hashedPassword;
        await hodscollection.insertOne(newHod);
        res.send({ message: "HOD created" });
    }
}));

// HOD login route
hodApp.post('/login', expressAsyncHandler(async (req, res) => {
    const hodCred = req.body;
    const dbHod = await hodscollection.findOne({ username: hodCred.username });
    if (dbHod === null) {
        res.send({ message: "Invalid username" });
    } else {
        const status = await bcryptjs.compare(hodCred.password, dbHod.password);
        if (status === false) {
            res.send({ message: "Invalid password" });
        } else {
            const signedToken = jwt.sign({ username: dbHod.username }, process.env.SECRET_KEY, { expiresIn: '1d' });
            res.send({ message: "login success", token: signedToken, user: dbHod });
        }
    }
}));
hodApp.get(
    "/profile",
    verifyToken,
    expressAsyncHandler(async (req, res) => {
      const username = req.user.username;
      const hodDetails= await hodscollection.findOne({ username });
      res.send({ message: "Profile data", data: hodDetails });
    })
  );

module.exports = hodApp;
