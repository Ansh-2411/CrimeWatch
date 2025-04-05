const { Router } = require("express");
const { handlenewreport, getreportbyID, getallreport } = require("../controllers/reportController"); // ✅ Ensure correct import
const path = require('path');
const fs = require('fs');
const router = Router();
const reportSchema = require('../models/reports')

// router.get("/", getallreport);
// router.post("/add-new", handlenewreport); // ✅ Ensure this function exists in the controller
router.get("/:id", getreportbyID);

router.post("/incidents", handlenewreport)


module.exports = router;
