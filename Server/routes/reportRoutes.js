const { Router } = require("express");
const { handlenewreport, getreportbyID, getallreport } = require("../controllers/reportController"); // ✅ Ensure correct import
const path = require('path');
const fs = require('fs');
const router = Router();
const reportSchema = require('../models/reports')

router.get("/", getallreport);
// router.post("/add-new", handlenewreport); // ✅ Ensure this function exists in the controller
router.get("/:id", getreportbyID);

router.post("/incidents", handlenewreport)


// Routes
// router.post('/incidents', async (req, res) => {
//     try {
//         const { crimetype, crimeDate, crimeTime, description, crimeimageURL } = req.body;
//         const location = req.body.location || {};

//         // Handle different location formats
//         let coordinates;

//         if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
//             // Format: {location: {coordinates: [long, lat], address: "..."}}
//             coordinates = location.coordinates;
//         } else if (location.latitude !== undefined && location.longitude !== undefined) {
//             // Format: {location: {latitude: lat, longitude: long}}
//             coordinates = [location.longitude, location.latitude];
//         } else {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid location format. Please provide valid coordinates.'
//             });
//         }

//         // Validate coordinates
//         if (!coordinates[0] || !coordinates[1] || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid location coordinates. Both longitude and latitude are required and must be numeric.'
//             });
//         }

//         // Create the incident object
//         const newIncident = {
//             crimetype,
//             location: {
//                 type: 'Point',
//                 coordinates,
//                 address: location.address || ''
//             },
//             crimeDate: new Date(crimeDate),
//             crimeTime,
//             description
//         };

//         // Add image URL if provided
//         if (crimeimageURL) {
//             newIncident.crimeimageURL = crimeimageURL;
//         }

//         // Save incident to database
//         const incident = new reportSchema(newIncident);
//         await incident.save();

//         res.status(201).json({
//             success: true,
//             message: 'Incident reported successfully',
//             data: incident
//         });

//     } catch (error) {
//         console.error('Error reporting incident:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error reporting incident',
//             error: error.message
//         });
//     }
// });


module.exports = router;
