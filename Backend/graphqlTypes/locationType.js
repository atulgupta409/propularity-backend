const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLID,
    GraphQLInt
  } = require('graphql');

  const CountryType = new GraphQLObjectType({
    name: 'Country',
    fields: {
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      dial_code: { type: GraphQLString },
      iso_code: { type: GraphQLString },
      description: { type: GraphQLString },
      active: { type: GraphQLBoolean },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    },
  });

  const StateType = new GraphQLObjectType({
    name: 'State',
    fields: {
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      country: { type: GraphQLList(CountryType) }, // You might want to use the CountryType here
      active: { type: GraphQLBoolean },
      priority: {
        type: new GraphQLObjectType({
          name: 'StatePriority',
          fields: {
            is_active: { type: GraphQLBoolean },
            order: { type: GraphQLString },
            country: { type: GraphQLList(CountryType) }, // You might want to use the CountryType here
          },
        }),
      },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    },
  });

  const CityType = new GraphQLObjectType({
    name: 'City',
    fields: {
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      country: { type: GraphQLList(CountryType) }, // You might want to use the CountryType here
      state: { type: GraphQLList(StateType) }, // You might want to use the StateType here
      active: { type: GraphQLBoolean },
      priority: {
        type: new GraphQLObjectType({
          name: 'CityPriority',
          fields: {
            is_active: { type: GraphQLBoolean },
            order: { type: GraphQLString },
            state: { type: GraphQLList(StateType) }, // You might want to use the StateType here
          },
        }),
      },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    },
  });

  const MicroLocationType = new GraphQLObjectType({
    name: 'MicroLocation',
    fields: {
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      country: { type: CountryType },
      state: { type: StateType },
      city: { type: CityType }, // Use CityType here
      active: { type: GraphQLBoolean },
      priority: {
        type: new GraphQLObjectType({
          name: 'MicroLocationPriority',
          fields: {
            is_active: { type: GraphQLBoolean },
            order: { type: GraphQLString },
            city: { type: CityType }, // Use CityType here
          },
        }),
      },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
    },
  });
  
  

  module.exports = {CityType, StateType, CountryType, MicroLocationType}