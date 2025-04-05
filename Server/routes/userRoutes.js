const { Router } = require("express");
const { handelsignup, handelsignin, handellogout, handelpolicesignup } = require("../controllers/userController");
const router = Router();

router.post("/signup", handelsignup);
router.post("/signin", handelsignin);
router.get("/logout", handellogout);

module.exports = router;
