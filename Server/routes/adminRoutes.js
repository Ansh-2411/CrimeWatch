const { Router } = require("express");

const router = Router();
const { handleRegister, handleLogin, addStation, getReport, getSubordinates } = require("../controllers/adminController");

// REGISTER API
router.post('/register', handleRegister);

// LOGIN API
router.post('/login', handleLogin);

// Create a new station
router.post('/addStation', addStation);

router.get('/my-reports/:userId', getReport);
router.get('/subordinates/:userId', getSubordinates);

const rankLevels = {
    'ADMIN': 0,
    'DGP': 1,
    'ADGP': 2,
    'IG': 3,
    'DIG': 4,
    'SP': 5,
    'DSP': 6,
    'IPS': 7,
    'PI': 8,
    'PSI': 9,
    'HEAD_CONSTABLE': 10,
    'CONSTABLE': 11
};

module.exports = router;
