const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritePlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

FavoritePlanSchema.index({ userId: 1, planId: 1 }, { unique: true });

module.exports = mongoose.model("FavoritePlan", FavoritePlanSchema);
