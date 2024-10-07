const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritePlaceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  placeId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FavoritePlaceSchema.index({ userId: 1, placeId: 1 }, { unique: true });

module.exports = mongoose.model("FavoritePlace", FavoritePlaceSchema);
