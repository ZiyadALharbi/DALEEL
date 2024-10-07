const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController.js");
const authorize = require("../middleware/roleVerification.js");

router.post("/create-place", authorize("owner"), ownerController.createPlace);
router.put("/update-place", authorize("owner"), ownerController.editPlace);
router.delete("/delete-place", authorize("owner"), ownerController.deletePlace);
