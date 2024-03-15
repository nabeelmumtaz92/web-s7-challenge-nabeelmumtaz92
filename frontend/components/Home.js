import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import pizza from './images/pizza.jpg';
import './App';
function Home() {
  return (
    <div>
      <h2>Welcome to Bloom Pizza!</h2>
      {/* Wrap the img in a Link component */}
      <Link to="/order">
        <img
          alt="Order pizza"
          style={{ cursor: 'pointer' }}
          src={pizza}
        />
      </Link>

    </div>
  );
}

export default Home;
