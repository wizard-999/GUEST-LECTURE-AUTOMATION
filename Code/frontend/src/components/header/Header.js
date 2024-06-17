// src/components/header/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";
const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/faculty-profile">Faculty Profile</Link></li>
          <li><Link to="/hod-profile">HOD Profile</Link></li>
          <li><Link to="/admin-profile">Admin Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
