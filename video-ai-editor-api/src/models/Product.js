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
    videos: {
      type: [{
        url: {
          type: String,
          required: true
        },
        analysis: {
          type: Object,
          required: false
        }
      }],
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
