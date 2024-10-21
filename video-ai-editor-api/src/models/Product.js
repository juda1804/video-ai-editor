const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    vomitoDeMercadoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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
    step: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", ProductSchema);
