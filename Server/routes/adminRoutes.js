const { Router } = require("express");

const router = Router();
const { handleRegister, handleLogin } = require("../controllers/adminController");

// REGISTER API
router.post('/register', handleRegister);

// LOGIN API
router.post('/login', handleLogin);

module.exports = router;
