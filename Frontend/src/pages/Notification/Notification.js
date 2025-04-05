import React, { useState } from "react";

// MapPin icon SVG
const MapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// AlertTriangle icon SVG
const AlertTriangle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

// Info icon SVG
const Info = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

function Notifications() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("local");

  // State for toggle switches
  const [settings, setSettings] = useState({
    localIncidents: true,
    nationalAlerts: true,
    reportUpdates: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle toggle change
  const handleToggleChange = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #fff;
            color: #000;
          }
          
          .container {
            padding: 1.5rem;
            font-family: sans-serif;
          }
          
          .title {
            font-size: 2.25rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
          }
          
          .flex-container {
            display: flex;
            gap: 1.5rem;
            flex-direction: column;
          }
          
          @media (min-width: 768px) {
            .flex-container {
              flex-direction: row;
            }
          }
          
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1.5rem;
            flex: 1;
          }
          
          .settings-card {
            width: 100%;
          }
          
          @media (min-width: 768px) {
            .settings-card {
              width: 24rem;
            }
          }
          
          .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
          
          .card-subtitle {
            color: #6b7280;
            margin-bottom: 1.5rem;
          }
          
          .tabs {
            display: flex;
            margin-bottom: 1.5rem;
          }
          
          .tab {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            font-weight: 500;
            background-color: #f3f4f6;
            color: #6b7280;
            cursor: pointer;
          }
          
          .tab.active {
            background-color: white;
            color: black;
          }
          
          .tab-left {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          
          .tab-right {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          
          .notification-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .notification-item {
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
          }
          
          .notification-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }
          
          .notification-title-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .icon-container {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .yellow-icon {
            background-color: #fef3c7;
          }
          
          .yellow-icon svg {
            color: #f59e0b;
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .blue-icon {
            background-color: #dbeafe;
          }
          
          .blue-icon svg {
            color: #3b82f6;
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .red-icon {
            background-color: #fee2e2;
          }
          
          .red-icon svg {
            color: #ef4444;
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .notification-title {
            font-weight: 700;
            font-size: 1.125rem;
          }
          
          .notification-time {
            color: #6b7280;
          }
          
          .notification-content {
            color: #6b7280;
            margin-bottom: 0.75rem;
          }
          
          .notification-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .location {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #6b7280;
          }
          
          .location svg {
            width: 1rem;
            height: 1rem;
          }
          
          .map-button {
            color: #2563eb;
            font-weight: 500;
            background: none;
            border: none;
            cursor: pointer;
          }
          
          .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          
          .toggle-container {
            margin-bottom: 1.5rem;
          }
          
          .toggle-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.25rem;
          }
          
          .toggle-label {
            font-weight: 500;
          }
          
          .toggle {
            position: relative;
            display: inline-flex;
            align-items: center;
            cursor: pointer;
          }
          
          .toggle input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .toggle-bg {
            width: 2.75rem;
            height: 1.5rem;
            background-color: #e5e7eb;
            border-radius: 9999px;
            transition: all 0.2s;
          }
          
          input:checked + .toggle-bg {
            background-color: black;
          }
          
          .toggle-dot {
            position: absolute;
            width: 1rem;
            height: 1rem;
            background-color: white;
            border-radius: 9999px;
            left: 0.25rem;
            bottom: 0.25rem;
            transition: all 0.2s;
          }
          
          input:checked ~ .toggle-dot {
            left: 1.5rem;
          }
          
          .toggle-description {
            color: #6b7280;
          }
          
          .section-spacer {
            margin-bottom: 2rem;
          }
        `}
      </style>

      <div className="container">
        <h1 className="title">Notifications</h1>

        <div className="flex-container">
          {/* Recent Notifications Section */}
          <div className="card">
            <h2 className="card-title">Recent Notifications</h2>
            <p className="card-subtitle">Stay informed about incidents in your area</p>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab tab-left ${activeTab === "local" ? "active" : ""}`}
                onClick={() => handleTabChange("local")}
              >
                Local (10km)
              </button>
              <button
                className={`tab tab-right ${activeTab === "all" ? "active" : ""}`}
                onClick={() => handleTabChange("all")}
              >
                All Notifications
              </button>
            </div>

            {/* Notification Items */}
            <div className="notification-list">
              {/* Theft Notification */}
              <div className="notification-item">
                <div className="notification-header">
                  <div className="notification-title-container">
                    <div className="icon-container yellow-icon">
                      <AlertTriangle />
                    </div>
                    <h3 className="notification-title">Theft Reported Near You</h3>
                  </div>
                  <span className="notification-time">2 hours ago</span>
                </div>
                <p className="notification-content">
                  A bicycle theft was reported 0.8km from your location. Stay vigilant and ensure your belongings are
                  secure.
                </p>
                <div className="notification-footer">
                  <div className="location">
                    <MapPin />
                    <span>Market Street & 7th</span>
                  </div>
                </div>
              </div>

              {/* Community Alert */}
              <div className="notification-item">
                <div className="notification-header">
                  <div className="notification-title-container">
                    <div className="icon-container blue-icon">
                      <Info />
                    </div>
                    <h3 className="notification-title">Community Alert</h3>
                  </div>
                  <span className="notification-time">Yesterday</span>
                </div>
                <p className="notification-content">
                  Police have increased patrols in your neighborhood following recent reports of suspicious activity.
                </p>
                <div className="location">
                  <MapPin />
                  <span>Financial District</span>
                </div>
              </div>

              {/* Vandalism Reported */}
              <div className="notification-item">
                <div className="notification-header">
                  <div className="notification-title-container">
                    <div className="icon-container red-icon">
                      <AlertTriangle />
                    </div>
                    <h3 className="notification-title">Vandalism Reported</h3>
                  </div>
                  <span className="notification-time">2 days ago</span>
                </div>
                <p className="notification-content">
                  Multiple vehicles were vandalized overnight. Check your vehicle if parked in the affected area.
                </p>
                <div className="notification-footer">
                  <div className="location">
                    <MapPin />
                    <span>Mission District</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className="card settings-card">
            <h2 className="card-title">Notification Settings</h2>
            <p className="card-subtitle">Customize how you receive alerts</p>

            <h3 className="section-title">Alert Types</h3>

            {/* Local Incidents Toggle */}
            <div className="toggle-container">
              <div className="toggle-header">
                <h4 className="toggle-label">Local Incidents (10km)</h4>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.localIncidents}
                    onChange={() => handleToggleChange("localIncidents")}
                  />
                  <div className="toggle-bg"></div>
                  <span className="toggle-dot"></span>
                </label>
              </div>
              <p className="toggle-description">Receive alerts about incidents within 10km</p>
            </div>

            {/* National Alerts Toggle */}
            <div className="toggle-container">
              <div className="toggle-header">
                <h4 className="toggle-label">National Alerts</h4>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.nationalAlerts}
                    onChange={() => handleToggleChange("nationalAlerts")}
                  />
                  <div className="toggle-bg"></div>
                  <span className="toggle-dot"></span>
                </label>
              </div>
              <p className="toggle-description">Important safety information nationwide</p>
            </div>

            {/* Report Updates Toggle */}
            <div className="toggle-container section-spacer">
              <div className="toggle-header">
                <h4 className="toggle-label">Report Updates</h4>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.reportUpdates}
                    onChange={() => handleToggleChange("reportUpdates")}
                  />
                  <div className="toggle-bg"></div>
                  <span className="toggle-dot"></span>
                </label>
              </div>
              <p className="toggle-description">Updates on reports you've submitted</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notifications;