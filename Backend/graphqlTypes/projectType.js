const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLScalarType
  } = require('graphql');
const {CityType, StateType, CountryType, MicroLocationType} = require('./locationType');
const BuilderType = require("./builderType")  
const Builder = require("../models/builderModel")
const Country = require("../models/countryModel")
const State = require("../models/stateModel")
const City = require("../models/cityModel")
const MicroLocation = require("../models/microLocationModel");
const { CategoryType, AmenityType } = require('./amenityType');
const PropertyType = require('../models/propertyTypeModel');
const Amenity = require('../models/amenitiesModel');
  const GeoLocationType = new GraphQLObjectType({
    name: 'GeoLocation',
    fields: {
      type: { type: GraphQLString },
      coordinates: { type: GraphQLList(GraphQLFloat) },
    },
  });

  const GraphQLDateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'ISO-8601 formatted date and time string',
    serialize(value) {
      // Convert the timestamp to a string in ISO-8601 format
      return new Date(value).toISOString();
    },
    parseValue(value) {
      // Parse the ISO-8601 string to a JavaScript Date object
      return new Date(value);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        // Parse the ISO-8601 string from the GraphQL query
        return new Date(ast.value);
      }
      return null;
    },
  });
  
const LocationType = new GraphQLObjectType({
    name: 'Location',
    fields: {
      address: { type: GraphQLString },
      country: {
        type: GraphQLList(CountryType), 
        resolve(parent, args) {
          return Country.find({ _id: { $in: parent.country } }); 
        },
      }, 
      state: {
        type: GraphQLList(StateType), 
        resolve(parent, args) {
          return State.find({ _id: { $in: parent.state } }); 
        },
      }, // You might want to use a StateType here
      city: {
        type: GraphQLList(CityType), 
        resolve(parent, args) {
          return City.find({ _id: { $in: parent.city } }); 
        },
      }, // You might want to use a CityType here
      micro_location: {
        type: GraphQLList(MicroLocationType), 
        resolve(parent, args) {
          return MicroLocation.find({ _id: { $in: parent.micro_location } }); 
        },
      }, // You might want to use a MicroLocationType here
      latitude: { type: GraphQLFloat },
      longitude: { type: GraphQLFloat },
      is_near_metro: { type: GraphQLBoolean },
      is_ferry_stop: { type: GraphQLBoolean },
      is_bus_stop: { type: GraphQLBoolean },
      is_taxi_stand: { type: GraphQLBoolean },
      is_tram: { type: GraphQLBoolean },
      is_hospital: { type: GraphQLBoolean },
      is_school: { type: GraphQLBoolean },
      is_restro: { type: GraphQLBoolean },
    },
  });
  const ContactDetailsType = new GraphQLObjectType({
    name: 'ContactDetails',
    fields: {
      id: { type: GraphQLID },
      user: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
      designation: { type: GraphQLString },
    },
  });
  const PlanType = new GraphQLObjectType({
    name: 'Plan',
    fields: {
      id: { type: GraphQLID },
      category: {
        type: GraphQLList(CategoryType), 
        resolve(parent, args) {
          return PropertyType.find({ _id: { $in: parent.category } }); 
        },
      }, // You might want to use a CategoryType here
      size: { type: GraphQLString },
      size_sq: { type: GraphQLString },
      price: { type: GraphQLString },
      image: { type: GraphQLList(GraphQLString) },
      should_show: { type: GraphQLBoolean },
    },
  });

  const ImageType = new GraphQLObjectType({
    name: 'Image',
    fields: {
      image: { type: GraphQLString },
      name: { type: GraphQLString },
      alt: { type: GraphQLString },
    },
  });
  const SeoType = new GraphQLObjectType({
    name: 'Seo',
    fields: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      robots: { type: GraphQLString },
      index: { type: GraphQLBoolean },
      keywords: { type: GraphQLString },
      url: { type: GraphQLString },
      status: { type: GraphQLBoolean },
      twitter: {
        type: new GraphQLObjectType({
          name: 'Twitter',
          fields: {
            title: { type: GraphQLString },
            description: { type: GraphQLString },
          },
        }),
      },
      open_graph: {
        type: new GraphQLObjectType({
          name: 'OpenGraph',
          fields: {
            title: { type: GraphQLString },
            description: { type: GraphQLString },
          },
        }),
      },
    },
  });

  const PriorityType = new GraphQLObjectType({
    name: 'Priority',
    fields: {
      is_active: { type: GraphQLBoolean },
      order: { type: GraphQLInt },
      microlocationId: { type: GraphQLID }, // You might want to use a MicroLocationType here
    },
  });
  const PopularType = new GraphQLObjectType({
    name: 'Popular',
    fields: {
      status: { type: GraphQLBoolean },
      order: { type: GraphQLInt },
      cityId: { type: GraphQLID }, // You might want to use a CityType here
    },
  });
  const BuilderProjectType = new GraphQLObjectType({
    name: 'BuilderProject',
    fields: () => ({
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      builder: {
        type: GraphQLList(BuilderType), // Use GraphQLList here
        resolve(parent, args) {
          return Builder.find({ _id: { $in: parent.builder } }); 
        },
      }, 
      project_type: { type: GraphQLString },
      slug: { type: GraphQLString },
      starting_price: { type: GraphQLString },
      brochure: {type: GraphQLString},
      configuration: { type: GraphQLString },
      ratings: { type: GraphQLFloat },
      coming_soon: { type: GraphQLString },
      project_status: { type: GraphQLString },
      project_size: { type: GraphQLString },
      short_descrip: { type: GraphQLString },
      for_rent: { type: GraphQLBoolean },
      for_sale: { type: GraphQLBoolean },
      location: { type: LocationType },
      plans: { type: GraphQLList(PlanType) }, // Define a PlanType similarly
      master_plan: { type: GraphQLString },
      highlights: { type: GraphQLString },
      amenties: {
        type: GraphQLList(AmenityType), 
        resolve(parent, args) {
          return Amenity.find({ _id: { $in: parent.amenties } }); 
        },
      },
      description: { type: GraphQLString },
      images: { type: GraphQLList(ImageType) }, // Define an ImageType similarly
      seo: { type: SeoType },
      geo_location: { type: GeoLocationType },
      contact_details: { type: GraphQLList(ContactDetailsType) },
      is_active: { type: GraphQLBoolean },
      status: { type: GraphQLString },
      priority: { type: PriorityType },
      is_popular: { type: PopularType },
      createdAt: { type: GraphQLDateTime },
      updatedAt: { type: GraphQLDateTime },
    }),
  });
  
  module.exports = BuilderProjectType;
  