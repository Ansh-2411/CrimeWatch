const PoliceUser = require('../models/officer');
const Station = require('../models/station');
const mongoose = require('mongoose');
const Report = require("../models/reports");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getSubordinateIds = async (userId) => {
    let result = [];
    const directSubs = await PoliceUser.find({ superior: userId }, '_id');
    for (const sub of directSubs) {
        result.push(sub._id);
        const lower = await getSubordinateIds(sub._id);
        result = result.concat(lower);
    }
    return result;
};

const getSubordinateTree = async (userId) => {
    let result = [];
    const directSubs = await PoliceUser.find({ superior: userId });

    for (const sub of directSubs) {
        result.push(sub);
        const lower = await getSubordinateTree(sub._id);
        result = result.concat(lower);
    }

    return result;
};

module.exports = {
    handleRegister: async (req, res) => {

        try {
            const {
                userName,
                password,
                fullName,
                badgeNumber,
                rank,
                rankLevel,
                superiorId,
                stationId,
                gender,
                contactNumber,
                email,
                address,
                joiningDate
            } = req.body;

            const existingUser = await PoliceUser.findOne({ userName });
            if (existingUser) return res.status(400).json({ msg: 'Username already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new PoliceUser({
                userName,
                password: hashedPassword,
                badgeNumber,
                fullName,
                rank,
                rankLevel,
                superior: superiorId || null,
                station: stationId,
                gender,
                contactNumber,
                email,
                address,
                joiningDate
            });

            await newUser.save();
            res.status(201).json({ msg: 'User registered successfully', user: newUser });

        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    handleLogin: async (req, res) => {
        try {
            const { userName, password } = req.body;
            const user = await PoliceUser.findOne({ userName });

            if (!user) return res.status(400).json({ msg: 'Invalid username or password' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid username or password' });

            const token = jwt.sign(
                {
                    id: user._id,
                    rank: user.rank,
                    rankLevel: user.rankLevel,
                    station: user.station
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    userName: user.userName,
                    fullName: user.fullName,
                    rank: user.rank,
                    rankLevel: user.rankLevel,
                    station: user.station
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    addStation: async (req, res) => {
        try {
            const {
                stationName,
                stationCode,
                address,
                phoneNumber,
                latitude,
                longitude,
                stationPI
            } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({ msg: 'Coordinates (latitude & longitude) are required' });
            }

            const existing = await Station.findOne({ stationCode });
            if (existing) {
                return res.status(400).json({ msg: 'Station code already exists.' });
            }

            const newStation = new Station({
                stationName,
                stationCode,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                    address
                },
                phoneNumber,
                stationPI: stationPI || null
            });

            await newStation.save();
            res.status(201).json({ msg: 'Station added successfully', station: newStation });

        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    },

    getReport: async (req, res) => {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg: "Invalid user ID" });
            }

            const officer = await PoliceUser.findById(userId);
            if (!officer) return res.status(404).json({ msg: "Officer not found" });

            // Get all subordinates recursively
            const subordinateIds = await getSubordinateIds(userId);
            const allRelevantIds = [userId, ...subordinateIds];

            // Fetch reports assigned to any of these users
            const reports = await Report.find({ assignedTo: { $in: allRelevantIds.map(id => id.toString()) } });

            res.status(200).json({ count: reports.length, reports });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    },
    getSubordinates: async (req, res) => {
        try {
            const { userId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ msg: 'Invalid user ID' });
            }

            const officer = await PoliceUser.findById(userId);
            if (!officer) {
                return res.status(404).json({ msg: 'Officer not found' });
            }

            const subordinates = await getSubordinateTree(userId);
            res.status(200).json({ count: subordinates.length, subordinates });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server error' });
        }
    }
}
