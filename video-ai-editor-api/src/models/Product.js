const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    copies: {
      type: [String],
      required: false,
    },
    landings: {
      type: [String],
      required: false,
    },
    videoUrls: {
      type: [String],
      required: false,
    },
    tikTokLinks: {
      type: [String],
      required: false,
    },
    angles: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", ProductSchema);
