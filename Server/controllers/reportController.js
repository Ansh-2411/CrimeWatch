const Reports = require("../models/reports");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function getreportbyID(req, res) {
  try {
    const reportId = req.params.id;

    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid report ID format" });
    }

    const report = await Reports.findById(reportId);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// In your reportController.js
const handlenewreport = async (req, res) => {
  try {
    const { crimetype, crimeDate, crimeTime, description, crimeimageURL } = req.body;
    const location = req.body.location || {};
    console.log(location)

    // Handle different location formats
    let coordinates = [location.latitude, location.longitude];

    if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
      // Format: {location: {coordinates: [long, lat], address: "..."}}
      coordinates = location.coordinates;
    } else if (location.latitude !== undefined && location.longitude !== undefined) {
      // Format: {location: {latitude: lat, longitude: long}}
      coordinates = [location.longitude, location.latitude];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid location format. Please provide valid coordinates.'
      });
    }

    // Validate coordinates
    // if (!coordinates[0] || !coordinates[1] || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid location coordinates. Both longitude and latitude are required and must be numeric.'
    //   });
    // }

    // Create the incident object
    const newIncident = {
      reportId: uuidv4(), // Ensure unique reportId
      crimetype,
      location: {
        type: 'Point',
        coordinates,
        address: location.address || ''
      },
      crimeDate: new Date(crimeDate),
      crimeTime,
      description
    };

    // Add image URL if provided
    if (crimeimageURL) {
      newIncident.crimeimageURL = crimeimageURL;
    }

    // Save incident to database
    const incident = new Reports(newIncident);
    await incident.save();

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: incident
    });

  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting incident',
      error: error.message
    });
  }
}

async function getallreport(req, res) {
  console.log("object")
  try {
    const reports = await Reports.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// ✅ Ensure all functions are properly exported
module.exports = {
  handlenewreport,
  getreportbyID,  // ✅ Ensure this is correctly defined and exported
  getallreport
};
