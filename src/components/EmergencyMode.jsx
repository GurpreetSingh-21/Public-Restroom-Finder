
import React from 'react';
import './EmergencyMode.css'; 

function EmergencyMode() {
  const handleEmergency = () => {
    alert('Emergency Mode Activated! Searching for the nearest restroom...');
  };

  return (
    <button onClick={handleEmergency} className="emergency-button">
      Emergency Mode 🚽
    </button>
  );
}

export default EmergencyMode;
