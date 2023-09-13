const mongoose = require("mongoose");

const builderProjectModel = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    builder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Builder",
    },
    project_type: String,
    plans_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyType",
    },
    slug: String,
    starting_price: String,
    configuration: String,
    ratings: Number,
    coming_soon: String,
    project_status: String,
    project_size: String,
    short_descrip: String,
    for_rent: {
      type: Boolean,
      default: false,
    },
    for_sale: {
      type: Boolean,
      default: false,
    },
    location: {
      address: String,
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      micro_location: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MicroLocation",
        },
      ],
      latitude: Number,
      longitude: Number,
      latitude2: Number,
      longitude2: Number,
      is_near_metro: {
        type: Boolean,
        default: false,
      },
      is_ferry_stop: {
        type: Boolean,
        default: false,
      },
      is_bus_stop: {
        type: Boolean,
        default: false,
      },
      is_taxi_stand: {
        type: Boolean,
        default: false,
      },
      is_tram: {
        type: Boolean,
        default: false,
      },
      is_hospital: {
        type: Boolean,
        default: false,
      },
      is_school: {
        type: Boolean,
        default: false,
      },
      is_restro: {
        type: Boolean,
        default: false,
      },
    },
    plans: [
      {
        id: Number,
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PropertyType",
        },
        size: String,
        size_sq: String,
        price: String,
        image: [],
        should_show: {
          type: Boolean,
          default: true,
        },
      },
    ],
    master_plan: String,
    highlights: String,
    amenties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    description: String,
    images: [
      {
        image: String,
        name: String,
        alt: String,
      },
    ],

    seo: {
      title: { type: String },
      description: { type: String },
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

    geo_location: {
      type: {
        type: String,
        enum: ["Point"], // We define this as a GeoJSON Point type
      },
      coordinates: {
        type: [Number],
      },
    },

    contact_details: [
      {
        id: Number,
        user: String,
        email: String,
        phone: String,
        designation: String,
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "approve", "reject"],
      default: "pending",
    },

    priority: [
      {
        is_active: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 1000,
        },
        microlocationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MicroLocation",
        },
      },
    ],
    is_popular: {
      status: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 1000,
      },
      cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
    },
    builder_priority: {
      is_active: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 1000,
      },
      builder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Builder",
      },
    },
    plans_priority: [{
      is_active: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 1000,
      },
      plans_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PropertyType",
      },
    }],
  },
  {
    timestamps: true,
  }
);
builderProjectModel.index({ geo_location: "2dsphere" });
const BuilderProject = mongoose.model("BuilderProject", builderProjectModel);
module.exports = BuilderProject;
