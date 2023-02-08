const transactions = require('./data');

const resolvers = {
  Query: {
    transactions: () => transactions,
  },
};

module.exports = resolvers;
