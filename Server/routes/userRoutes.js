const { Router } = require("express");
const { handelsignup, handelsignin, handellogout ,getUserReports} = require("../controllers/userController");
const router = Router();

router.post("/signup", handelsignup);
router.post("/signin", handelsignin);
router.get("/logout", handellogout);
router.get('/getReports/:id', getUserReports);

module.exports = router;
