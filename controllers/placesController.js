const Place = require("./models/Place.js");

exports.getPlaceDetails = async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = router;
