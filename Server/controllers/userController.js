const User = require('../models/user');
const Reports = require("../models/reports");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
JWT_SECRET = 'secret_key'


const getUserReports = async (req,res) => {
    try {
        const userId = req.params.id; 
        const reports = await Reports.find({ createdBy: userId });
        return res.status(200).json({ data: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ data: error.message });
    }
};

async function handelsignup(req, res) {
    try {

        const { fullName, email, password } = req.body;
        console.log(req.body)

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        console.log(newUser)

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
const handelsignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

function handellogout(req, res) {
    res.clearCookie("token").redirect("/");
};

module.exports = {
    getUserReports,
    handelsignup,
    handelsignin,
    handellogout,
};
