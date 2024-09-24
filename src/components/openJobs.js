import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OpenJobs = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State to hold open jobs
  const [openJobs, setOpenJobs] = useState([]);
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  // Load open jobs from localStorage on component mount
  useEffect(() => {
    const savedOpenJobs = JSON.parse(localStorage.getItem('openJobs')) || [];
    setOpenJobs(savedOpenJobs);
  }, []);

  // Function to delete an open job
  const deleteJob = (index) => {
    const updatedJobs = openJobs.filter((_, i) => i !== index);
    setOpenJobs(updatedJobs);
    localStorage.setItem('openJobs', JSON.stringify(updatedJobs)); // Update localStorage
  };

  // Function to move a job to the "closed jobs" section
  const closeJob = (index) => {
    const closedJobs = JSON.parse(localStorage.getItem('closedJobs')) || [];
    closedJobs.push(openJobs[index]);

    // Update localStorage for closed jobs
    localStorage.setItem('closedJobs', JSON.stringify(closedJobs));

    // Remove the job from open jobs
    deleteJob(index);
  };

  // Function to add or update an expense for a specific job
  const addExpense = (jobIndex, description, amount) => {
    if (!description || !amount) return; // Do not allow empty values

    const updatedJobs = [...openJobs];
    const expense = { description, amount: parseFloat(amount) };

    // Add the new expense to the job's expenses
    updatedJobs[jobIndex].expenses = updatedJobs[jobIndex].expenses || [];
    updatedJobs[jobIndex].expenses.push(expense);

    // Update the total to include the expense
    updatedJobs[jobIndex].total += parseFloat(amount);

    setOpenJobs(updatedJobs);
    localStorage.setItem('openJobs', JSON.stringify(updatedJobs)); // Save updated jobs to localStorage

    // Reset expense fields
    setNewExpenseDescription('');
    setNewExpenseAmount('');
  };

  // Function to delete an expense
  const deleteExpense = (jobIndex, expenseIndex) => {
    const updatedJobs = [...openJobs];
    const expenseAmount = updatedJobs[jobIndex].expenses[expenseIndex].amount;

    // Remove the expense from the list
    updatedJobs[jobIndex].expenses.splice(expenseIndex, 1);

    // Update the total after removing the expense
    updatedJobs[jobIndex].total -= expenseAmount;

    setOpenJobs(updatedJobs);
    localStorage.setItem('openJobs', JSON.stringify(updatedJobs)); // Save updated jobs to localStorage
  };

  // Function to add notes for rooms, extras, and paints
  const updateNote = (jobIndex, itemIndex, type, value) => {
    const updatedJobs = [...openJobs];
    updatedJobs[jobIndex][type][itemIndex].note = value; // Update the note for the specified type
    setOpenJobs(updatedJobs);
    localStorage.setItem('openJobs', JSON.stringify(updatedJobs)); // Save updated jobs to localStorage
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Jobs</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate('/')} // Navigate back to the dashboard
        >
          Home
        </button>
      </header>

      {/* Display Open Jobs */}
      {openJobs.length > 0 ? (
        openJobs.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Job #{job.jobNumber}</span>
              <span>{job.customerName}</span>
              <span>{job.date}</span>
            </div>

            {/* Job Details */}
            <div className="mb-4">
              <p>Address: {job.address}</p>
              <p>Phone: {job.phoneNumber}</p>
              <p>Total: ${job.total.toFixed(2)}</p>
            </div>

            {/* Add Notes for each Room */}
            <div className="mb-4">
              <h3 className="font-semibold">Room Notes</h3>
              {job.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="mb-2">
                  <p>{room.roomName} - {room.cost}</p>
                  <textarea
                    className="border p-2 w-full"
                    placeholder="Add note for this room"
                    value={room.note || ""}
                    onChange={(e) => updateNote(jobIndex, roomIndex, "rooms", e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* List of Expenses */}
            <div className="mb-4">
              <h3 className="font-semibold">Expenses</h3>
              {job.expenses && job.expenses.length > 0 ? (
                job.expenses.map((expense, expenseIndex) => (
                  <div key={expenseIndex} className="flex justify-between mb-2">
                    <span>{expense.description}</span>
                    <span>${expense.amount.toFixed(2)}</span>
                    <button
                      className="bg-pink text-white p-1 rounded"
                      onClick={() => deleteExpense(jobIndex, expenseIndex)}
                    >
                      Delete Expense
                    </button>
                  </div>
                ))
              ) : (
                <p>No expenses added yet.</p>
              )}
            </div>

            {/* Add Expense */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Expense Description"
                className="border p-2 w-full mb-2"
                value={newExpenseDescription}
                onChange={(e) => setNewExpenseDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Expense Amount"
                className="border p-2 w-full mb-2"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
              <button
                className="bg-blue text-white p-2 rounded"
                onClick={() => addExpense(jobIndex, newExpenseDescription, newExpenseAmount)}
              >
                Add Expense
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-blue text-white p-2 rounded"
                onClick={() => {
                  navigate('/estimate-calculator', { state: { job, jobIndex } });
                }}
              >
                Edit Job
              </button>

              <button
                className="bg-tealLight text-white p-2 rounded"
                onClick={() => closeJob(jobIndex)}
              >
                Close Job
              </button>

              <button
                className="bg-pink text-white p-2 rounded"
                onClick={() => deleteJob(jobIndex)}
              >
                Delete Job
              </button>
            </div>

            {/* Totals Section */}
            <div className="section-bordered border-t mt-4 pt-4">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${job.total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>GST/HST (13%):</p>
                <p>${(job.total * 0.13).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>${(job.total * 1.13).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No open jobs found</p>
      )}
    </div>
  );
};

export default OpenJobs;
