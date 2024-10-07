const express = require("express");
const router = express.Router();

const placeController = require("../controllers/placesController.js");

router.get("/places/:placeId", placeController.getPlaceDetails);
