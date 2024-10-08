import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; 
import AboutUs from "./Pages/AboutUs.jsx"; 
import Home from "./Pages/Home.jsx"; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Removed FindRestrooms route */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
