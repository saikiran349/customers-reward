import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TRANSACTIONS = gql`
  query {
    transactions {
      customerId
      date
      amount
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.transactions.map(transaction => (
        <li key={transaction.customerId}>
          Customer ID: {transaction.customerId} Date: {transaction.date} Amount: ${transaction.amount}
        </li>
      ))}
    </ul>
  );
}

export default App;
