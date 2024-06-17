import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import Logout from '../Logout/Logout';
import './HodProfile.css';

const HodProfile = () => {
  const { user } = useContext(UserContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('http://localhost:4000/lecture-api/pending-requests', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setPendingRequests(response.data.requests);
      } catch (error) {
        setError('Failed to fetch pending requests');
      }
    };

    fetchPendingRequests();
  }, [user]);

  const handleApproval = async (requestId, action) => {
    try {
      const response = await axios.post(`http://localhost:4000/lecture-api/${action}-request`, { requestId }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.data.success) {
        setPendingRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
      } else {
        setError(response.data.message || 'Failed to update request');
      }
    } catch (error) {
      setError('Failed to update request');
    }
  };

  const handleGenerateReport = () => {
    // Add your generate report logic here
    console.log('Generate report logic here');
  };

  if (!user || user.role !== 'hod') {
    return <div>Unauthorized access</div>;
  }

  return (
    <div className="hod-profile">
      <h2>HOD Profile</h2>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><button onClick={handleGenerateReport}>Generate Report</button></li>
        </ul>
      </nav>
      <Logout />
      <h3>Pending Requests</h3>
      {error && <div className="error">{error}</div>}
      <ul>
        {pendingRequests.map(request => (
          <li key={request._id}>
            <p><strong>Topic:</strong> {request.topic}</p>
            <p><strong>Date:</strong> {request.date}</p>
            <p><strong>Time:</strong> {request.time}</p>
            <p><strong>Resource Person:</strong> {request.resourcePerson}</p>
            <p><strong>Attendees:</strong> {request.attendees}</p>
            <p><strong>Venue:</strong> {request.venue}</p>
            <p><strong>Description:</strong> {request.description}</p>
            <button onClick={() => handleApproval(request._id, 'approve')}>Approve</button>
            <button onClick={() => handleApproval(request._id, 'reject')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HodProfile;
