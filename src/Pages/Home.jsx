import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for routing
import RateTheRestroom from "../components/RateTheRestroom";
import Map from '../components/Map';
import Popup from '../components/Popup';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import images from the assets folder
import logo from '../assets/public_restroom_finder.png';
import networkIcon from '../assets/network.png';
import starRatingIcon from '../assets/star_rating.png';
import googleMapIcon from '../assets/google_map.png';
import ambulanceIcon from '../assets/ambulance.png';

function Home() {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const [popupContent, setPopupContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState([0, 0]);

  const handleFindRestrooms = () => {
    if (location.trim() === "") {
      alert("Please enter a location.");
      return;
    }
    alert(`Searching for restrooms near: ${location}`);
  };

  return (
    <div className="Home-background">
      <div className="home">
        <header className="header">
          <div className="logo">
            <img
              src={logo} // Updated image reference
              alt="Public Restroom Finder Logo"
              className="logo-img"
              style={{ width: "100%", height: "auto", maxWidth: "500px" }}
            />
            <h4 className="logo-text">Public Restroom Finder</h4>
          </div>
          <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/about-us">About Us</Link>
          </nav>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter location..."
              className="search-bar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="find-button" onClick={handleFindRestrooms}>
              Find
            </button>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <h1>🚻 Find Clean Public Restrooms Near You</h1>
            <h2>🧼 Locate, Rate & Review in Real-Time!</h2>
          </div>
        </section>

        <div className="map">
          <div id="map-container" className="card mx-auto" style={{ maxWidth: '800px', borderRadius: '10px', overflow: 'hidden', margin: '30px auto' }}>
            <Map
              setPopupContent={setPopupContent}
              setShowPopup={setShowPopup}
              setPopupPosition={setPopupPosition}
            />
          </div>
          <Popup
            content={popupContent}
            position={popupPosition}
            show={showPopup}
            onClose={() => setShowPopup(false)}
          />
        </div>

        {/* New Ratings Section */}
        <RateTheRestroom />

        <section className="features">
          <h3>Core Features</h3>
          <div className="feature-cards">
            <div className="feature-card-1">
              <img src={networkIcon} alt="Crowdsourced Data" className="feature-icon" />
              <h4>Crowdsourced Data</h4>
              <p>Locate the nearest restroom based on real-time user data.</p>
            </div>
            <div className="feature-card-2">
              <img src={starRatingIcon} alt="Cleanliness Ratings" className="feature-icon" />
              <h4>Cleanliness Ratings</h4>
              <p>Access reviews and cleanliness ratings for public restrooms.</p>
            </div>
            <div className="feature-card-3">
              <img src={googleMapIcon} alt="Google Maps Integration" className="feature-icon" />
              <h4>Maps Integration</h4>
              <p>Get directions to the nearest public restroom facility quickly.</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-left">
            Built with ❤️ by our community of restroom finders.
          </div>
          <div className="footer-right">
            © 2024 Public Restroom Finder. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
