const PoliceUser = require('../models/officer');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
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
    }
}
