const { GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat,GraphQLUnionType, } = require('graphql');
const {AmenityType} = require('./graphqlTypes/amenityType');
const Amenity = require('./models/amenitiesModel'); // Import your Amenity model
const ProjectType = require("./graphqlTypes/projectType")
const BuilderProject = require("./models/builderProjectModel")
const City = require("./models/cityModel");
const MicroLocation = require('./models/microLocationModel');
const { MicroLocationType,CityType } = require('./graphqlTypes/locationType');
const BuilderProjectType = require('./graphqlTypes/projectType');
const Builder = require('./models/builderModel');
const BuilderType = require('./graphqlTypes/builderType');
const PropertyType = require("./models/propertyTypeModel")
const PaginatedBuilderProjectsType = new GraphQLObjectType({
  name: 'PaginatedBuilderProjects',
  fields: () => ({
    totalCount: { type: GraphQLInt },
    filteredProjects: { type: GraphQLList(ProjectType) },
  }),
});
const SearchResultType = new GraphQLUnionType({
  name: "SearchResult",
  types: [CityType, MicroLocationType, BuilderType, ProjectType],
  resolveType: (value) => {
    if (value instanceof City) return CityType;
    if (value instanceof MicroLocation) return MicroLocationType;
    if (value instanceof Builder) return BuilderType;
    if (value instanceof BuilderProject) return ProjectType;
  },
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
        location: {type: GraphQLString},
        city: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
          const page = args.page || 1;
          const perPage = args.perPage || 10;

          const skip = (page - 1) * perPage;
          const regexCitySlug = new RegExp(`^${args.city}$`, "i");
          const city = await City.findOne({ name: regexCitySlug }).exec();
          if (!city) {
          return console.log("City not found");
        }
        const regexMicrolocationSlug = new RegExp(`^${args.location}$`, "i");
    
        const microlocationsInCity = await MicroLocation.find({
          name: regexMicrolocationSlug,
          city: city._id,
        }).exec();
        if (microlocationsInCity.length === 0) {
          return console.log("microlocation not found");
        }
          const totalCount = await BuilderProject.countDocuments({"location.micro_location": microlocationsInCity[0]._id,
          "priority.microlocationId": microlocationsInCity[0]._id, status: "approve",});
          
           
          const projects = await BuilderProject.find({"location.micro_location": microlocationsInCity[0]._id,
           "priority.microlocationId": microlocationsInCity[0]._id, status: "approve",})
            .skip(skip)
            .limit(perPage);
         
            const filteredProjects = projects.filter((otherProject) => {
              return otherProject.priority.some((priority) => {
                if (
                  priority.microlocationId &&
                  priority.microlocationId.toString() === microlocationsInCity[0]._id.toString()
                ) {
                  return priority.order !== 1000;
                }
              });
            });
          
            filteredProjects.sort((a, b) => {
              const priorityA = a.priority.find(
                (priority) =>
                  priority.microlocationId && priority.microlocationId.toString() === microlocationsInCity[0]._id.toString()
              );
              const priorityB = b.priority.find(
                (priority) =>
                  priority.microlocationId && priority.microlocationId.toString() === microlocationsInCity[0]._id.toString()
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
      type: GraphQLList(BuilderType),
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
    buildersBySlug: {
      type: GraphQLList(BuilderType),
      args: {
        slug: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
          const builder = await Builder.find({slug: args.slug})
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
    topIndiaProjects: {
      type: GraphQLList(ProjectType),
      async resolve(parent, args) {
        try {
        const projects = await BuilderProject.find({
        status: "approve",
        "priority_india.order": { $nin: [0, 1000] },
    })
      .populate("location.city", "name")
      .sort({ "priority_india.order": 1 }) // Sort by priority.order in ascending order
      .exec();
         
         return projects
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
    topProjectsByPlanAndCity: {
      type: GraphQLList(ProjectType),
      args: {
        city: { type: GraphQLString },
        planType: { type: GraphQLString }
      },
      async resolve(parent, args) {
        try {
          const city = await City.find({name: { $regex: args.city, $options: 'i' }})
          
         const planType = await PropertyType.find({name: { $regex: args.planType, $options: 'i' }})
         const projects = await BuilderProject.find({
          "location.city": city[0]._id,
           plans_type: planType[0]._id,
           status: "approve",
    })
      .populate("location.city", "name") 
      .exec();

      const filteredProjects = projects.filter((otherProject) => {
        return otherProject.plans_priority.some((priority) => {
          if (priority.plans_type && priority.plans_type.toString() === planType[0]._id.toString()) {
            return priority.order !== 1000;
          }
        });
      });
      filteredProjects.sort((a, b) => {
        const priorityA = a.plans_priority.find(
          (priority) =>
            priority.plans_type && priority.plans_type.toString() === planType[0]._id.toString()
        );
        const priorityB = b.plans_priority.find(
          (priority) =>
            priority.plans_type && priority.plans_type.toString() === planType[0]._id.toString()
        );
  
        return priorityA.order - priorityB.order;
      });

         return filteredProjects;
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
    projectsByLocationForSearch: {
      type: GraphQLList(ProjectType),
      args: {
        city: { type: GraphQLString },
        location: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
      const regexCitySlug = new RegExp(`^${args.city}$`, "i");
      const city = await City.findOne({ name: regexCitySlug }).exec();
      if (!city) {
      return console.log("City not found")
    }
    const regexMicrolocationSlug = new RegExp(`^${args.location}$`, "i");

    const microlocationsInCity = await MicroLocation.find({
      name: regexMicrolocationSlug,
      city: city._id,
    }).exec();
    if (microlocationsInCity.length === 0) {
      return console.log("microlocation not found");
    }

        const projects = await BuilderProject.find({
           "location.city": city._id,
           "location.micro_location": microlocationsInCity[0]._id,
             status: "approve",
        })
          return projects;
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
    projectsByBuilder: {
      type: GraphQLList(ProjectType),
      args: {
        builderName: { type: GraphQLString }
      },
      async resolve(parent, args) {
        try {
          const builder = await Builder.find({name: { $regex: args.builderName, $options: 'i' }})

        const projects = await BuilderProject.find({
        builder : builder[0]._id,
        status: "approve",
    })
         return projects
        } catch (error) {
          console.error('Error in builder resolver:', error);
          throw error;
        }
      },
    },
    search: {
      type: GraphQLList(SearchResultType),
      args: {
        searchTerm: { type: GraphQLString },
      },
      resolve: async (parent, args) => { // Use 'async' here
        const { searchTerm } = args;
        const searchResults = [];
    
        try {
          // Perform searches in all models (City, MicroLocation, Builder, Project)
          const cityResults = await City.find({ name: { $regex: searchTerm, $options: "i" } });
          const microLocationResults = await MicroLocation.find({ name: { $regex: searchTerm, $options: "i" } });
          const builderResults = await Builder.find({ name: { $regex: searchTerm, $options: "i" } });
          const projectResults = await BuilderProject.find({ name: { $regex: searchTerm, $options: "i" } });
    
          // Push the results into the searchResults array
          searchResults.push(...cityResults, ...microLocationResults, ...builderResults, ...projectResults);
    
          return searchResults;
        } catch (error) {
          console.error("Error in search resolver:", error);
          throw error;
        }
      },
    },
      projectsByBuilderAndTypes: {
      type: PaginatedBuilderProjectsType,
      args: {
         page: { type: GraphQLInt },
        perPage: { type: GraphQLInt },
        builderName: { type: GraphQLString },
        type: {type: GraphQLString}
      },
      async resolve(parent, args) {
        try {
           const page = args.page || 1;
          const perPage = args.perPage || 10;
           const skip = (page - 1) * perPage;
          const builder = await Builder.find({name: { $regex: args.builderName, $options: 'i' }})
        const totalCount = await BuilderProject.countDocuments({
          builder : builder[0]._id,
          project_type: { $regex: args.type, $options: 'i' },
          status: "approve",
      })
        const filteredProjects = await BuilderProject.find({
        builder : builder[0]._id,
        project_type: args.type,
        status: "approve",
    }) .skip(skip)
       .limit(perPage);
       return {
        totalCount,
        filteredProjects,
      };
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
