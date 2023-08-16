const mongoose = require("mongoose");

const builderModel = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: String,
    starting_price: String,
    configuration: String,
    estb_year: Number,
    ratings: Number,
    type: String,
    residential_num: Number,
    commercial_num: Number,
    coming_soon: String,
    slug: String,
    is_active: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        image: String,
        name: String,
        alt: String,
      },
    ],
    BuilderLogo: String,
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
    ],
    seo: {
      title: { type: String },
      description: { type: String },
      footer_title: String,
      footer_description: String,
      robots: String,
      index: Boolean,
      keywords: String,
      url: String,
      status: {
        type: Boolean,
        default: true,
      },
      twitter: {
        title: String,
        description: String,
      },
      open_graph: {
        title: String,
        description: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Builder = mongoose.model("Builder", builderModel);
module.exports = Builder;
