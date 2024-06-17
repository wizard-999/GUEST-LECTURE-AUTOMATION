import React from 'react';
import { useSelector } from 'react-redux';
import './FacultyProfile.css';
import Logout from '../Logout/Logout';

const FacultyProfile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.facultyHODAdmin);

  if (!isAuthenticated) {
    return <div>Please log in to access your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Faculty Profile</h2>
        <nav className="profile-nav">
          <ul>
            <li><a href="/request-guest-lecture">Request Guest Lecture</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
          </ul>
        </nav>
        <Logout />
      </div>
      
      <div className="card">
        <h3>Welcome, {user.username}</h3>
        <p>Here you can manage your guest lecture requests and view your dashboard.</p>
      </div>
      
      <div className="card">
        <h3>Quick Actions</h3>
        <ul>
          <li><a href="/request-guest-lecture">Submit a new guest lecture request</a></li>
          <li><a href="/dashboard">View your dashboard</a></li>
        </ul>
      </div>
    </div>
  );
};

export default FacultyProfile;
