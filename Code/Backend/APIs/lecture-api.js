const express = require('express');
const lectureApp = express.Router();
const { ObjectId } = require('mongodb');
require('dotenv').config();

// Middleware to parse JSON bodies
lectureApp.use(express.json());

// Endpoint to submit a guest lecture request
lectureApp.post('/submit-request', async (req, res) => {
  const { date, time, topic, attendees, venue, hodName, resourcePerson, description, facultyId } = req.body;
  const lecturecollection = req.app.get('lecturecollection');
  const facultycollection = req.app.get('facultycollection');
  const hodscollection = req.app.get('hodscollection');

  try {
    const faculty = await facultycollection.findOne({ _id: new ObjectId(facultyId) });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    const hod = await hodscollection.findOne({ name: hodName });
    if (!hod) {
      return res.status(404).json({ success: false, message: 'HOD not found' });
    }

    const result = await lecturecollection.insertOne({
      date,
      time,
      topic,
      attendees,
      venue,
      hodName,
      resourcePerson,
      description,
      facultyId,
      status: 'pending'
    });

    res.json({ success: true, message: 'Request submitted successfully', data: result.ops[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit request', error: error.message });
  }
});

// Endpoint to approve a guest lecture request
lectureApp.post('/approve-request', async (req, res) => {
  const { requestId } = req.body;
  const lecturecollection = req.app.get('lecturecollection');

  try {
    const result = await lecturecollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'approved' } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Request approved successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve request', error: error.message });
  }
});

// Endpoint to reject a guest lecture request
lectureApp.post('/reject-request', async (req, res) => {
  const { requestId } = req.body;
  const lecturecollection = req.app.get('lecturecollection');

  try {
    const result = await lecturecollection.updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'rejected' } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: 'Request rejected successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject request', error: error.message });
  }
});

lectureApp.get('/pending-requests', async (req, res) => {
  const lecturecollection = req.app.get('lecturecollection');
  const hodscollection = req.app.get('hodscollection');
  const { user } = req;

  if (user.role !== 'hod') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }

  try {
    const hod = await hodscollection.findOne({ email: user.email });
    if (!hod) {
      return res.status(404).json({ success: false, message: 'HOD not found' });
    }

    const requests = await lecturecollection.find({ hodName: hod.name, status: 'pending' }).toArray();
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch pending requests', error: error.message });
  }
});

module.exports = lectureApp;
