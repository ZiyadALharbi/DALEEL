const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ownerUserName: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Restaurant",
      "Hotel",
      "Museum",
      "Park",
      "Shopping Center",
      "Historical Site",
      "Other",
    ],
  },
  address: String,
  locationURL: string, // google map URL
  city: String,
  country: String,
  photos: [String],
  openingHours: {
    type: Map,
    of: String,
  },
  contactInfo: {
    phone: String,
    website: String,
    email: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

PlaceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Place", PlaceSchema);
