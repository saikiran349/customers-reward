// CustomerRewards.js
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions($startDate: String!, $endDate: String!) {
    transactions(startDate: $startDate, endDate: $endDate) {
      customerId
      amount
      date
    }
  }
`;

const CustomerRewards = () => {
  const [startDate, setStartDate] = useState('2022-11-01');
  const [endDate, setEndDate] = useState('2022-12-31');
  const { loading, error, data } = useQuery(GET_TRANSACTIONS, {
    variables: { startDate, endDate },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  const transactionsByCustomer = data.transactions.reduce((acc, transaction) => {
    const customerId = transaction.customerId;
    if (!acc[customerId]) {
      acc[customerId] = [];
    }
    acc[customerId].push(transaction);
    return acc;
  }, {});

  const calculateRewardsPoints = (amount) => {
    let points = 0;

    if (amount > 100) {
      points += 2 * (amount - 100);
    }
    if (amount > 50) {
      points += 1 * (amount - 50);
    }

    return points;
  };

  const rewardsByCustomer = Object.keys(transactionsByCustomer).map((customerId) => {
    const transactions = transactionsByCustomer[customerId];
    const rewardsByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthYear = `${year}-${month + 1}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          monthYear,
          rewards: 0,
        };
      }

      acc[monthYear].rewards += calculateRewardsPoints(transaction.amount);
      return acc;
    }, {});

    const totalRewards = Object.values(rewardsByMonth).reduce(
      (acc, month) => acc + month.rewards,
      0
    );

    return {
      customerId,
      rewardsByMonth,
      totalRewards,
    };
  });

  return (
    <div>
      <h2>Customer Rewards</h2>
      <p>
        Start Date:{' '}
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </p>
      <p>
        End Date:{' '}
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </p>
