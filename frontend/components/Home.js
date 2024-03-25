import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import pizza from './images/pizza.jpg';
import Form from './Form';

function Home() {
  return (
    <div>
      <h2>Welcome to Bloom Pizza!</h2>
      {/* Wrap the img in a Link component */}
      <Link to="/order">
        <img
          alt="order-pizza"
          style={{ cursor: 'pointer' }}
          src={pizza}
        />
      </Link>


    </div>
  );
}

export default Home;
