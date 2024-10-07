const Place = require("./models/Place.js");

exports.createPlace = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      address,
      locationURL,
      city,
      country,
      photos,
      openingHours,
      contactInfo,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "Name and category are required." });
    }

    const place = new Place({
      name,
      description,
      ownerId: req.user._id,
      ownerUserName: req.user.username,
      category,
      address,
      locationURL,
      city,
      country,
      photos,
      openingHours,
      contactInfo,
    });

    await place.save();

    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.editPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const updates = req.body;

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    if (place.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this place." });
    }

    Object.assign(place, updates, { updatedAt: Date.now() });

    await place.save();

    res.json(place);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    if (place.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this place." });
    }

    await Place.deleteOne({ _id: placeId });

    res.json({ message: "Place deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
