const exp = require('express');
const app = exp();
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;
const path = require('path');
require('dotenv').config();

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Deploy react build in this server
app.use(exp.static(path.join(__dirname, '../client/build')));
// To parse the body of req
app.use(exp.json());

// Connect to DB
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    // Get db obj
    const vnrdb = client.db('vnrdb');
    // Get collection obj
    const facultycollection = vnrdb.collection('facultycollection');
    const hodscollection = vnrdb.collection('hodscollection');
    const adminscollection = vnrdb.collection('adminscollection');
    const lecturecollection = vnrdb.collection('lecturecollection');

    // Share collection obj with express app
    app.set('facultycollection', facultycollection);
    app.set('hodscollection', hodscollection);
    app.set('adminscollection', adminscollection);
    app.set('lecturecollection', lecturecollection);
    // Confirm db connection status
    console.log("DB connection success");
  })
  .catch(err => console.log("Err in DB connection", err));

// Import API routes
const facultyApp = require('./APIs/faculty-api');
const hodApp = require('./APIs/hod-api');
const adminApp = require('./APIs/admin-api');
const lectureApp = require('./APIs/lecture-api');

// If path starts with faculty-api, send req to facultyApp
app.use('/faculty-api', facultyApp);
// If path starts with hod-api, send req to hodApp
app.use('/hod-api', hodApp);
// If path starts with admin-api, send req to adminApp
app.use('/admin-api', adminApp);
// If path starts with lecture-api, send req to lectureApp
app.use('/lecture-api', lectureApp);

// Deals with page refresh
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Express error handler
app.use((err, req, res, next) => {
  res.send({ message: "error", payload: err.message });
});

// Assign port number
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Web server on port ${port}`));
