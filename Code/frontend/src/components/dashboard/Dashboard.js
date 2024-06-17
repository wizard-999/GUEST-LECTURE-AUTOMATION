import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch requests from the backend
    // setRequests(fetchedRequests);
  }, []);

  const handleApprove = (id) => {
    // Approve request logic
    // Send approval email to faculty
  };

  const handleReject = (id, reason) => {
    // Reject request logic
    // Send rejection email to faculty with reason
  };

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h2>{user.role} Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name of Lecture</th>
            <th>Resource Person</th>
            <th>Faculty Coordinator</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id}>
              <td>{index + 1}</td>
              <td>{request.lectureName}</td>
              <td>{request.resourcePerson}</td>
              <td>{request.facultyCoordinator}</td>
              <td>{request.venue}</td>
              <td>{request.date}</td>
              <td>{request.attendees}</td>
              <td>
                <button onClick={() => handleApprove(request.id)}>Approve</button>
                <button onClick={() => handleReject(request.id, 'Reason for rejection')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
