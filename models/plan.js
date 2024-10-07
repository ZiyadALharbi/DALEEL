const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceInDaySchema = new Schema({
  placeId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  visitTime: Date,
  notes: String,
  photosLinks: [String],
  order: Number,
  addedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

PlaceInDaySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const DaySchema = new Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  date: Date,
  places: [PlaceInDaySchema],
});

const PlanSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  description: String,
  destination: String,
  duration: Number,
  isPublic: {
    type: Boolean,
    default: false,
  },
  days: [DaySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

PlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Plan", PlanSchema);
