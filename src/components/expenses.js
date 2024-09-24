import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [expenses, setExpenses] = useState([]);

  // Load all expenses from open jobs on mount
  useEffect(() => {
    const openJobs = JSON.parse(localStorage.getItem('openJobs')) || [];
    const allExpenses = openJobs.reduce((acc, job) => {
      if (job.expenses && job.expenses.length > 0) {
        job.expenses.forEach((expense) => {
          acc.push({ ...expense, jobNumber: job.jobNumber, customerName: job.customerName });
        });
      }
      return acc;
    }, []);
    setExpenses(allExpenses);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home and Add Expense Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <div>
          <button
            className="bg-green text-white p-2 rounded mr-4"
            onClick={() => navigate('/')} // Navigate back to the dashboard
          >
            Home
          </button>
          <button
            className="bg-blue text-white p-2 rounded"
            onClick={() => navigate('/open-jobs')} // Navigate to Open Jobs to add expenses
          >
            Add Expense
          </button>
        </div>
      </header>

      {/* Expenses List */}
      <div className="mb-4">
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <p>Job #{expense.jobNumber} - {expense.customerName}</p>
              <p>Description: {expense.description}</p>
              <p>Amount: ${expense.amount.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No expenses recorded.</p>
        )}
      </div>
    </div>
  );
};

export default Expenses;
