const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const SeoTypes = new GraphQLObjectType({
  name: 'SeoContent',
  fields: () => ({
    page_title: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    robots: { type: GraphQLString },
    index: { type: GraphQLBoolean },
    keywords: { type: GraphQLString },
    url: { type: GraphQLString },
    footer_title: { type: GraphQLString },
    footer_description: { type: GraphQLString },
    script: { type: GraphQLString },
    header_description: { type: GraphQLString },
    status: { type: GraphQLBoolean },
    path: { type: GraphQLString },
   twitter: {
            type: new GraphQLObjectType({
              name: 'SeoTwitter',
              fields: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
              },
            }),
          },
          open_graph: {
            type: new GraphQLObjectType({
              name: 'SeoOpenGraph',
              fields: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
              },
            }),
          },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

module.exports = {SeoTypes};