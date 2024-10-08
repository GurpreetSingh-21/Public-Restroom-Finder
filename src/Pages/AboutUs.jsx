import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us-body">
      <div className="about-us-container">
        <h2>About Us</h2>
        <p>
          Welcome to <strong>Public Restroom Near Me</strong>! We’re a team of rideshare drivers who have faced the same frustrating problem countless times: finding a clean, safe restroom when you need one most. Whether it’s a long shift or just a busy day in the city, we know how stressful it can be when nature calls and you’re caught in traffic or far from home.
        </p>
        <p>
          We created this platform to help fellow drivers and anyone else in need to find nearby restrooms quickly and easily. By teaming up with local businesses, parks, and public spaces, we aim to ensure that clean and accessible restrooms are just a tap away.
        </p>
        <p>
          <br />
          Here’s what we offer:
          <ul>
            <li>Search for restrooms based on your current location</li>
            <li>Check cleanliness ratings and user reviews</li>
            <li>Find accessible restrooms for those who need them</li>
            <li>Get real-time updates on restroom availability</li>
          </ul>
        </p>
        <p>
          We’re passionate about making life easier for our fellow drivers and everyone who spends time on the go. Join us in turning the often overlooked restroom hunt into a stress-free experience, one restroom at a time!
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
