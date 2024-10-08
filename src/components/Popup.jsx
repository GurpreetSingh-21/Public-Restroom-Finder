// src/components/Popup.jsx
import React from 'react';

const Popup = ({ content, position, show, onClose }) => {
    if (!show) return null;

    return (
        <div
            className="custom-popup card"
            style={{
                position: 'absolute',
                left: position[0],
                top: position[1],
                zIndex: 1000,
            }}
        >
            <div className="card-header">
                <h5 className="card-title">Location Info</h5>
            </div>
            <div className="card-body">
                <p className="card-text" dangerouslySetInnerHTML={{ __html: content }} />
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${content.split('<br>')[1].split(': ')[1].split('<')[0]},${content.split('<br>')[2].split(': ')[1]}`}
                    target="_blank"
                    className="btn btn-primary"
                >
                    Navigate
                </a>
                <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
