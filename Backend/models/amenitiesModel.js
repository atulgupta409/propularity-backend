const mongoose = require("mongoose");

const amenityModel = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    icon: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Amenity = mongoose.model("Amenity", amenityModel);
module.exports = Amenity;
