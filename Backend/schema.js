const { GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');
const {AmenityType} = require('./graphqlTypes/amenityType');
const Amenity = require('./models/amenitiesModel'); // Import your Amenity model
const ProjectType = require("./graphqlTypes/projectType")
const BuilderProject = require("./models/builderProjectModel")
const City = require("./models/cityModel");
const MicroLocation = require('./models/microLocationModel');

const PaginatedBuilderProjectsType = new GraphQLObjectType({
  name: 'PaginatedBuilderProjects',
  fields: () => ({
    totalCount: { type: GraphQLInt },
    results: { type: GraphQLList(ProjectType) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    amenities: {
      type: GraphQLList(AmenityType),
      resolve() {
        return Amenity.find({});
      },
    },
    projects: {
      type: GraphQLList(ProjectType),
      async resolve(parent, args) {
        try {
        return await BuilderProject.find({})
        } catch (error) {
          console.error('Error in builderProjects resolver:', error);
          throw error;
        }
      },
    },
    builderProjects: {
      type: PaginatedBuilderProjectsType,
      args: {
        page: { type: GraphQLInt },
        perPage: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        try {
          const page = args.page || 1;
          const perPage = args.perPage || 10;

          const skip = (page - 1) * perPage;

          const totalCount = await BuilderProject.countDocuments({});

          const results = await BuilderProject.find({})
            .skip(skip)
            .limit(perPage);

          return {
            totalCount,
            results,
          };
        } catch (error) {
          console.error('Error in builderProjects resolver:', error);
          throw error;
        }
      },
    },
    searchProjects: {
      type: GraphQLList(ProjectType),
      args: {
        name: { type: GraphQLString },
        city: { type: GraphQLString },
        microlocation: { type: GraphQLString },
        status: {type: GraphQLString}
      },
      async resolve(parent, args) {
        const searchCriteria = {};
  
        if (args.name) {
          searchCriteria.name = { $regex: args.name, $options: 'i' };
        }
        if (args.city) {
          const city = await City.findOne({ name: { $regex: args.city, $options: 'i' } });
          if (city) {
            searchCriteria['location.city'] = city._id;
          }else {
            // Return empty array when city doesn't match any cities
            return [];
          }
        }
        if (args.microlocation) {
          const microlocation = await MicroLocation.findOne({ name: { $regex: args.microlocation, $options: 'i' } });
          if (microlocation) {
            searchCriteria['location.micro_location'] = microlocation._id;
          }else {
            // Return empty array when city doesn't match any cities
            return [];
          }
        }
        if (args.status) {
          searchCriteria.status = args.status;
        }
        try {
          const searchResults = await BuilderProject.find(searchCriteria);
          return searchResults;
        } catch (error) {
          console.error('Error in searchProjects resolver:', error);
          throw error;
        }
      },
    },
    
    
  },
});
module.exports = new GraphQLSchema({
    query: RootQuery
  });
