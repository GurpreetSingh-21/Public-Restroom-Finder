import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map as OlMap, View, Feature } from 'ol';
import { fromLonLat, toLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import "../components/Map.css";

const Map = ({ setPopupContent, setShowPopup, setPopupPosition }) => {
    const mapRef = useRef(null);
    const [bathrooms, setBathrooms] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [closestBathrooms, setClosestBathrooms] = useState([]);
    const [addingRestroom, setAddingRestroom] = useState(false);
    const [newRestroom, setNewRestroom] = useState({
        name: '',
        hours: '',
        days: '', // Added to store the days of operation
    });

    // Function to calculate distance between two coordinates (in miles)
    const calculateDistance = (coord1, coord2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const lat1 = toRad(coord1[1]);
        const lon1 = toRad(coord1[0]);
        const lat2 = toRad(coord2[1]);
        const lon2 = toRad(coord2[0]);

        return (
            6371 * Math.acos(
                Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
            ) * 0.621371 // Convert to miles
        );
    };

    // Fetch bathroom data
    useEffect(() => {
        const fetchBathrooms = async () => {
            try {
                const response = await fetch('https://data.cityofnewyork.us/resource/i7jb-7jku.json');
                const data = await response.json();

                const apiBathrooms = data.map(bathroom => ({
                    coord: fromLonLat([parseFloat(bathroom.longitude), parseFloat(bathroom.latitude)]),
                    name: bathroom.facility_name,
                    hours: bathroom.hours_of_operation || 'Hours not available',
                }));

                // Hardcoded bathroom locations
                const hardcodedBathrooms = [
                    { coord: fromLonLat([-74.0060, 40.7128]), name: "New York City, USA" },
                    { coord: fromLonLat([-73.975189, 40.715899]), name: "East River Park Zone 3", hours: "8am-4pm, Open later seasonally" },
                    { coord: fromLonLat([-73.843252, 40.751662]), name: "Passerelle Building", hours: "8am-4pm, Open later seasonally" },
                    { coord: fromLonLat([-74.006873, 40.743643]), name: "The High Line Zone 1", hours: "Year Round" },
                ];

                setBathrooms([...hardcodedBathrooms, ...apiBathrooms]);
            } catch (error) {
                console.error("Error fetching bathroom data:", error);
            }
        };

        fetchBathrooms();
    }, []);

    useEffect(() => {
        const map = new OlMap({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([-74.0060, 40.7128]), // Centering the map around NYC
                zoom: 12,
            }),
        });

        const features = bathrooms.map(bathroom => new Feature({
            geometry: new Point(bathroom.coord),
            name: bathroom.name,
            hours: bathroom.hours,
            latLong: toLonLat(bathroom.coord),
        }));

        const vectorSource = new VectorSource({ features });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                    scale: 0.05,
                }),
            }),
        });

        map.addLayer(vectorLayer);

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userCoordinates = [position.coords.longitude, position.coords.latitude];
                setUserLocation(fromLonLat(userCoordinates));

                const userFeature = new Feature({
                    geometry: new Point(fromLonLat(userCoordinates)),
                    name: "Your Location",
                    latLong: userCoordinates,
                });

                userFeature.setStyle(new Style({
                    image: new CircleStyle({
                        radius: 10,
                        fill: new Fill({ color: 'rgba(0, 128, 255, 0.5)' }),
                        stroke: new Stroke({ color: '#007bff', width: 2 }),
                    }),
                }));

                vectorSource.addFeature(userFeature);
                map.getView().setCenter(fromLonLat(userCoordinates));
                map.getView().setZoom(14);

                // Calculate closest bathrooms
                const closest = [...bathrooms].map(bathroom => ({
                    ...bathroom,
                    distance: calculateDistance(userCoordinates, toLonLat(bathroom.coord)),
                })).sort((a, b) => a.distance - b.distance).slice(0, 3);

                setClosestBathrooms(closest);
            }, error => {
                console.error('Error getting user location:', error);
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }

        map.on('singleclick', evt => {
            const feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);
            if (feature) {
                const latLon = feature.get('latLong');
                const name = feature.get('name');
                const hours = feature.get('hours');
                setPopupContent(`${name}<br>Latitude: ${latLon[1].toFixed(4)}<br>Longitude: ${latLon[0].toFixed(4)}<br>Hours: ${hours}`);
                setShowPopup(true);
                setPopupPosition([evt.pixel[0], evt.pixel[1]]);
            } else {
                setShowPopup(false);
            }
        });

        map.on('pointermove', evt => {
            const hit = map.hasFeatureAtPixel(evt.pixel);
            map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });

        return () => map.setTarget(undefined); // Cleanup on component unmount
    }, [bathrooms, setPopupContent, setShowPopup, setPopupPosition]);

    // Function to navigate to the bathroom location
    const navigateToBathroom = (coord) => {
        setPopupContent(`Navigating to ${coord.name}<br>Hours: ${coord.hours}`);
        setShowPopup(true);
        setPopupPosition([mapRef.current.clientWidth / 2, mapRef.current.clientHeight / 2]); // Center the popup
        map.getView().setCenter(coord.coord);
        map.getView().setZoom(14);
    };

    // Function to handle adding a restroom
    const handleAddRestroom = () => {
        const newBathroomCoord = fromLonLat([-74.0060, 40.7128]); // Placeholder for the added restroom's coordinates

        const newBathroomFeature = new Feature({
            geometry: new Point(newBathroomCoord),
            name: newRestroom.name,
            hours: newRestroom.hours || 'Hours not available',
            latLong: toLonLat(newBathroomCoord),
        });

        const vectorSource = new VectorSource();
        vectorSource.addFeature(newBathroomFeature);

        setBathrooms([...bathrooms, {
            name: newRestroom.name,
            coord: newBathroomCoord,
            hours: newRestroom.hours,
            days: newRestroom.days, // Added days to the bathroom object
        }]);

        setAddingRestroom(false); // Hide the form
    };

    return (
        <div className="container">
            <div className="map" ref={mapRef} style={{ height: '500px' }}></div>
            <div>
                <h3 className='text-h3'>Closest Bathrooms:</h3>
                <ul>
                    {closestBathrooms.map((bathroom, index) => (
                        <li key={index}>
                            {bathroom.name} - {bathroom.distance.toFixed(2)} miles away: <br />
                            <button className='navigo' onClick={() => navigateToBathroom(bathroom)}> Go </button>
                        </li>
                    ))}
                </ul>
            </div>
            <button className='addroom' onClick={() => setAddingRestroom(!addingRestroom)}>
                {addingRestroom ? 'Cancel' : 'Add Restroom'}
            </button>
            {addingRestroom && (
                <div className="restroom-form">
                    <form onSubmit={handleAddRestroom}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={newRestroom.name}
                            onChange={(e) => setNewRestroom({ ...newRestroom, name: e.target.value })}
                            required
                        />
                        <label>Hours:</label>
                        <input
                            type="text"
                            value={newRestroom.hours}
                            onChange={(e) => setNewRestroom({ ...newRestroom, hours: e.target.value })}
                        />
                        <label>Days:</label>
                        <input
                            type="text"
                            value={newRestroom.days}
                            onChange={(e) => setNewRestroom({ ...newRestroom, days: e.target.value })}
                        />
                        <button type="submit" className='addroom'>Add Restroom</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Map;
