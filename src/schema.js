const { gql } = require('apollo-server');

const typeDefs = gql`
  type Transaction {
    customerId: Int!
    date: String!
    amount: Float!
  }

  type Query {
    transactions: [Transaction]!
  }
`;

module.exports = typeDefs;
