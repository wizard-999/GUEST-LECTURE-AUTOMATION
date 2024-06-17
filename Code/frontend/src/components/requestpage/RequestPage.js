import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import './RequestPage.css';

const RequestPage = () => {
  const { user, loading } = useContext(UserContext); // Add loading state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [attendees, setAttendees] = useState('');
  const [venue, setVenue] = useState('');
  const [hodName, setHodName] = useState('');
  const [resourcePerson, setResourcePerson] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    const requestData = {
      date,
      time,
      topic,
      attendees,
      venue,
      hodName,
      resourcePerson,
      description,
      facultyId: user._id, // Ensure user._id is available
    };

    try {
      const response = await axios.post('http://localhost:4000/lecture-api/submit-request', requestData);

      if (response.data.success) {
        alert('Request submitted successfully!');
      } else {
        setError(response.data.message || 'Failed to submit request');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Request submission failed');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!user) {
    return <div>Please log in to submit a request.</div>; // Handle unauthenticated state
  }

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <h2>Request Guest Lecture</h2>
      {error && <div className="error">{error}</div>}
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </label>
      <label>
        Topic:
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required />
      </label>
      <label>
        Number of Attendees:
        <input type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} required />
      </label>
      <label>
        Venue:
        <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
      </label>
      <label>
        HOD Name:
        <input type="text" value={hodName} onChange={(e) => setHodName(e.target.value)} required />
      </label>
      <label>
        Resource Person:
        <input type="text" value={resourcePerson} onChange={(e) => setResourcePerson(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default RequestPage;
