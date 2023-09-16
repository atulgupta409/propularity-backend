const { GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');
const {AmenityType} = require('./graphqlTypes/amenityType');
const Amenity = require('./models/amenitiesModel'); // Import your Amenity model
const ProjectType = require("./graphqlTypes/projectType")
const BuilderProject = require("./models/builderProjectModel")
const City = require("./models/cityModel");
const MicroLocation = require('./models/microLocationModel');
const { MicroLocationType } = require('./graphqlTypes/locationType');
const BuilderProjectType = require('./graphqlTypes/projectType');
const Builder = require('./models/builderModel');

const PaginatedBuilderProjectsType = new GraphQLObjectType({
  name: 'PaginatedBuilderProjects',
  fields: () => ({
    totalCount: { type: GraphQLInt },
    filteredProjects: { type: GraphQLList(ProjectType) },
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
    projectDetails: {
      type: GraphQLList(ProjectType),
      args: {
        slug: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
        return await BuilderProject.find({slug: args.slug, status: "approve"})
        } catch (error) {
          console.error('Error in builderProjects resolver:', error);
          throw error;
        }
      },
    },
    builderProjectsByLocation: {
      type: PaginatedBuilderProjectsType,
      args: {
        page: { type: GraphQLInt },
        perPage: { type: GraphQLInt },
        location: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
          const page = args.page || 1;
          const perPage = args.perPage || 10;

          const skip = (page - 1) * perPage;
          const location = await MicroLocation.find({name: { $regex: args.location, $options: 'i' }})
          const totalCount = await BuilderProject.countDocuments({"location.micro_location": location[0]._id,
          "priority.microlocationId": location[0]._id, status: "approve",});
          
           
          const projects = await BuilderProject.find({"location.micro_location": location[0]._id,
           "priority.microlocationId": location[0]._id, status: "approve",})
            .skip(skip)
            .limit(perPage);
         
            const filteredProjects = projects.filter((otherProject) => {
              return otherProject.priority.some((priority) => {
                if (
                  priority.microlocationId &&
                  priority.microlocationId.toString() === location[0]._id.toString()
                ) {
                  return priority.order !== 1000;
                }
              });
            });
          
            filteredProjects.sort((a, b) => {
              const priorityA = a.priority.find(
                (priority) =>
                  priority.microlocationId && priority.microlocationId.toString() === location[0]._id.toString()
              );
              const priorityB = b.priority.find(
                (priority) =>
                  priority.microlocationId && priority.microlocationId.toString() === location[0]._id.toString()
              );
        
              return priorityA.order - priorityB.order;
            });

          return {
            totalCount,
            filteredProjects,
          };
        } catch (error) {
          console.error('Error in builderProjects resolver:', error);
          throw error;
        }
      },
    },
    microlocations: {
      type: GraphQLList(MicroLocationType),
      args: {
        city: { type: GraphQLString }
      },
      async resolve(parent, args) {
        try {
          const city = await City.findOne({name: { $regex: args.city, $options: 'i' }, active: true})
        return await MicroLocation.find({city: city._id})
        } catch (error) {
          console.error('Error in microlocation resolver:', error);
          throw error;
        }
      },
    },
    allmicrolocations: {
      type: GraphQLList(MicroLocationType),
      async resolve(parent, args) {
        try {
        const microlocations =  await MicroLocation.find({active: true})
        .populate('city', 'name')
        .exec(); // Add .exec() to execute the query

      return microlocations;
        } catch (error) {
          console.error('Error in microlocation resolver:', error);
          throw error;
        }
      },
    },
    builders: {
      type: GraphQLList(BuilderProjectType),
      async resolve(parent, args) {
        try {
          const builder = await Builder.find()
         return builder
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
    projectsByCity: {
      type: GraphQLList(ProjectType),
      args: {
        city: { type: GraphQLString }
      },
      async resolve(parent, args) {
        try {
          const city = await City.find({name: { $regex: args.city, $options: 'i' }})

          const projects = await BuilderProject.find({
        "location.city": city[0]._id,
        status: "approve",
        "is_popular.order": { $nin: [0, 1000] },
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .sort({ "is_popular.order": 1 }) // Sort by priority.order in ascending order
      .exec();

         return projects
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
  },
});
module.exports = new GraphQLSchema({
    query: RootQuery
  });
