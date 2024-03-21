import React from 'react';
import Home from './Home';
import Form from './Form';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';


function App() {
  return (
    <div id="app">
      <nav>
        <NavLink to="/">Home</NavLink> 
        <NavLink to="/order">Order</NavLink> 
      </nav>
      {/* Correctly using Route and Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
