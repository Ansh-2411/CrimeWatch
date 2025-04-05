import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to update map center dynamically
const ChangeView = ({ center, shouldUpdate }) => {
  const map = useMap();
  if (shouldUpdate && center) {
    map.setView(center, map.getZoom());
  }
  return null;
};

const CurrentLocationMap = ({ formData, onLocationSelect }) => {
  const [initialLocation, setInitialLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState("Fetching location...");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldUpdateMapCenter, setShouldUpdateMapCenter] = useState(true);

  // Fetch address from coordinates
  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const locationName = data.display_name || "Unknown Location";
      setAddress(locationName);
      
      // Update parent component with location data
      if (onLocationSelect) {
        onLocationSelect([lat, lon], locationName);
      }
    } catch (err) {
      setAddress("Unable to fetch location name");
      console.error("Error fetching address:", err);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setInitialLocation([lat, lon]);
        setMarkerPosition([lat, lon]); // Set marker to current location
        fetchAddress(lat, lon);
        setLoading(false);
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setLoading(false);
      }
    );
  }, []);

  // Handle marker drag event
  const handleMarkerDrag = (event) => {
    const { lat, lng } = event.target.getLatLng();
    setMarkerPosition([lat, lng]);
    fetchAddress(lat, lng);
  };

  return (
    <div className="space-y-2">
      {loading && <p className="text-gray-500">Loading your location...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && (
        <div className="text-sm space-y-1">
          <p><strong>Selected Address:</strong> {address}</p>
          <p>
            <strong>Coordinates:</strong> {markerPosition?.[0]?.toFixed(6)}, {markerPosition?.[1]?.toFixed(6)}
          </p>
        </div>
      )}

      {initialLocation && (
        <div style={{ height: "300px", width: "100%" }}>
          <MapContainer
            center={initialLocation}
            zoom={15}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <ChangeView center={markerPosition} shouldUpdate={shouldUpdateMapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={markerPosition}
              draggable={true}
              eventHandlers={{ dragend: handleMarkerDrag }}
              icon={customIcon}
            >
              <Popup>
                <b>Drag me to set location</b>
                <br />
                {address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default CurrentLocationMap;