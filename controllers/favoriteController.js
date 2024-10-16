const FavoritePlace = require("./models/FavoritePlace.js");
const FavoritePlan = require("./models/FavoritePlan.js");
const Place = require("./models/Place.js");

exports.addPlaceToFavorites = async (req, res) => {
  try {
    const { placeId } = req.body;

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found." });
    }

    const existingFavorite = await FavoritePlace.findOne({
      userId: req.user._id,
      placeId: placeId,
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Place is already in favorites." });
    }

    const favoritePlace = new FavoritePlace({
      userId: req.user._id,
      placeId: placeId,
    });

    await favoritePlace.save();

    res.status(201).json({ message: "Place added to favorites." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.removePlaceFromFavorites = async (req, res) => {
  try {
    const { placeId } = req.params;

    const result = await FavoritePlace.deleteOne({
      userId: req.user._id,
      placeId: placeId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favorite place not found." });
    }

    res.json({ message: "Place removed from favorites." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFavoritePlaces = async (req, res) => {
  try {
    const favorites = await FavoritePlace.find({
      userId: req.user._id,
    }).populate("placeId");

    const favoritePlaces = favorites.map((fav) => fav.placeId);

    res.json(favoritePlaces);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addPlanToFavorites = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan || !plan.isPublic) {
      return res
        .status(404)
        .json({ error: "Plan not found or is not public." });
    }

    const existingFavorite = await FavoritePlan.findOne({
      userId: req.user._id,
      planId: planId,
    });

    if (existingFavorite) {
      return res.status(400).json({ error: "Plan is already in favorites." });
    }

    const favoritePlan = new FavoritePlan({
      userId: req.user._id,
      planId: planId,
    });

    await favoritePlan.save();

    res.status(201).json({ message: "Plan added to favorites." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.removePlanFromFavorites = async (req, res) => {
  try {
    const { planId } = req.params;

    const result = await FavoritePlan.deleteOne({
      userId: req.user._id,
      planId: planId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Favorite plan not found." });
    }

    res.json({ message: "Plan removed from favorites." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFavoritePlans = async (req, res) => {
  try {
    const favorites = await FavoritePlan.find({
      userId: req.user._id,
    }).populate("planId");

    const favoritePlans = favorites.map((fav) => fav.planId);

    res.json(favoritePlans);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
