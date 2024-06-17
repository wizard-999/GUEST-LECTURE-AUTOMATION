import "./Login.css";
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log(`Submitting login for ${username} as ${role}`);
    try {
      const response = await axios.post(`http://localhost:4000/${role}-api/login`, { username, password });
      console.log('Response:', response.data);
      if (response.data.message === 'login success') {
        const { user, token } = response.data;

        setUser({ ...user, role });

        localStorage.setItem('token', token);

        if (role === 'admin') {
          navigate('/admin-profile');
        } else if (role === 'hod') {
          navigate('/hod-profile');
        } else {
          navigate('/faculty-profile');
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.response && error.response.data ? error.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <input 
        type="text" 
        id="username" 
        name="username"
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        id="password" 
        name="password"
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <div>
        <label>
          <input 
            type="radio" 
            id="role-admin" 
            name="role" 
            value="admin" 
            checked={role === 'admin'} 
            onChange={(e) => setRole(e.target.value)} 
          />
          Admin
        </label>
        <label>
          <input 
            type="radio" 
            id="role-faculty" 
            name="role" 
            value="faculty" 
            checked={role === 'faculty'} 
            onChange={(e) => setRole(e.target.value)} 
          />
          Faculty
        </label>
        <label>
          <input 
            type="radio" 
            id="role-hod" 
            name="role" 
            value="hod" 
            checked={role === 'hod'} 
            onChange={(e) => setRole(e.target.value)} 
          />
          HOD
        </label>
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
 