// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Our Website</h1>
      <p>This is the public homepage.</p>
      <Link to="/admin">Go to Admin Dashboard</Link>
    </div>
  );
};

export default Home;