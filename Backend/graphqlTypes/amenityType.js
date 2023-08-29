const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const AmenityType = new GraphQLObjectType({
  name: 'Amenity',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    icon: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});



module.exports = {AmenityType, CategoryType};
