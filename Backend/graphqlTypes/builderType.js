const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLInt, GraphQLFloat } = require('graphql');
const City  = require("../models/cityModel")
const {CityType} = require("./locationType")
const ImageType = new GraphQLObjectType({
    name: 'builderImage',
    fields: {
      image: { type: GraphQLString },
      name: { type: GraphQLString },
      alt: { type: GraphQLString },
    },
  });


const BuilderType = new GraphQLObjectType({
  name: 'Builder',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    starting_price: { type: GraphQLString },
    configuration: { type: GraphQLString },
    estb_year: { type: GraphQLInt },
    ratings: { type: GraphQLFloat },
    type: { type: GraphQLString },
    residential_num: { type: GraphQLInt },
    commercial_num: { type: GraphQLInt },
    coming_soon: { type: GraphQLString },
    slug: { type: GraphQLString },
    is_active: { type: GraphQLBoolean },
    images: { type: GraphQLList(ImageType)},  
    BuilderLogo: { type: GraphQLString },
    cities: { type: GraphQLList(CityType),
      resolve(parent, args) {
        return City.find({ _id: { $in: parent.cities } }); 
      }, },
    seo: {
      type: new GraphQLObjectType({
        name: 'BuilderSeo',
        fields: {
          title: { type: GraphQLString },
          description: { type: GraphQLString },
          footer_title: { type: GraphQLString },
          footer_description: { type: GraphQLString },
          robots: { type: GraphQLString },
          index: { type: GraphQLBoolean },
          keywords: { type: GraphQLString },
          url: { type: GraphQLString },
          status: { type: GraphQLBoolean },
          twitter: {
            type: new GraphQLObjectType({
              name: 'BuilderSeoTwitter',
              fields: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
              },
            }),
          },
          open_graph: {
            type: new GraphQLObjectType({
              name: 'BuilderSeoOpenGraph',
              fields: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
              },
            }),
          },
        },
      }),
    },
 
  },
});

module.exports = BuilderType;
