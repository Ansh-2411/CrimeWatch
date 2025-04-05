const { Router } = require("express");
const { getlocal,getnational,getreportupdates } = require("../controllers/notificationController");
const router = Router();

router.get("/local/:id",getlocal);
router.get("/national/:id",getnational);
router.get("/reportupdate/:id",getreportupdates);

module.exports = router;