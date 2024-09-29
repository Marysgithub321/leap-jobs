import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  // Form state for adding direct expense
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseReceipt, setNewExpenseReceipt] = useState(null); // State for uploaded receipt image
  const [newJobNumber, setNewJobNumber] = useState(""); // New field for Job Number

  // Load all expenses from open jobs and direct expenses on mount
  useEffect(() => {
    const openJobs = JSON.parse(localStorage.getItem('openJobs')) || [];
    const allExpenses = openJobs.reduce((acc, job) => {
      if (job.expenses && job.expenses.length > 0) {
        job.expenses.forEach((expense) => {
          acc.push({ ...expense, jobNumber: job.jobNumber, customerName: job.customerName, source: 'openJobs' });
        });
      }
      return acc;
    }, []);

    const savedDirectExpenses = JSON.parse(localStorage.getItem("directExpenses")) || [];
    const directExpensesWithSource = savedDirectExpenses.map(expense => ({ ...expense, source: 'directExpenses' }));

    setExpenses([...allExpenses, ...directExpensesWithSource]);
  }, []);

  // Function to handle receipt image upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewExpenseReceipt(reader.result); // Convert file to Base64 and save in state
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Function to add a new expense directly from the Expenses component
  const addDirectExpense = () => {
    if (!newExpenseDescription || !newExpenseAmount) {
      alert("Please fill in the description and amount.");
      return;
    }

    const newExpense = {
      description: newExpenseDescription,
      amount: parseFloat(newExpenseAmount),
      receipt: newExpenseReceipt, // Store the uploaded receipt (Base64 string)
      jobNumber: newJobNumber || "N/A", // Use N/A if no job number is provided
      source: 'directExpenses' // Mark as direct expense
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);

    // Save new expense to localStorage
    const savedDirectExpenses = JSON.parse(localStorage.getItem("directExpenses")) || [];
    savedDirectExpenses.push(newExpense);
    localStorage.setItem("directExpenses", JSON.stringify(savedDirectExpenses));

    // Reset form fields
    setNewExpenseDescription("");
    setNewExpenseAmount("");
    setNewExpenseReceipt(null);
    setNewJobNumber(""); // Reset job number field
  };

  // Function to delete an expense
  const deleteExpense = (expenseIndex, source, jobNumber = null) => {
    let updatedExpenses = [...expenses];

    if (source === 'openJobs' && jobNumber !== null) {
      // Delete from openJobs
      const openJobs = JSON.parse(localStorage.getItem('openJobs')) || [];
      const jobIndex = openJobs.findIndex(job => job.jobNumber === jobNumber);
      
      if (jobIndex > -1) {
        openJobs[jobIndex].expenses.splice(expenseIndex, 1); // Remove the expense from job
        localStorage.setItem('openJobs', JSON.stringify(openJobs));
      }
    } else if (source === 'directExpenses') {
      // Delete from directExpenses
      const savedDirectExpenses = JSON.parse(localStorage.getItem("directExpenses")) || [];
      savedDirectExpenses.splice(expenseIndex, 1);
      localStorage.setItem("directExpenses", JSON.stringify(savedDirectExpenses));
    }

    // Remove from current state
    updatedExpenses.splice(expenseIndex, 1);
    setExpenses(updatedExpenses);
  };

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

      {/* Add Direct Expense Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Add Direct Expense</h3>
        <input
          type="text"
          placeholder="Job Number (Optional)"
          className="border p-2 w-full mb-2"
          value={newJobNumber}
          onChange={(e) => setNewJobNumber(e.target.value)}
        />
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
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-2"
          onChange={handleReceiptUpload} // Handle receipt upload
        />
        <button
          className="bg-blue text-white p-2 rounded"
          onClick={addDirectExpense}
        >
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <div className="mb-4">
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <p>Job #{expense.jobNumber || "N/A"} - {expense.customerName || "Direct Expense"}</p>
              <p>Description: {expense.description}</p>
              <p>Amount: ${expense.amount.toFixed(2)}</p>
              {expense.receipt && (
                <div className="mt-2">
                  <p>Receipt:</p>
                  <img src={expense.receipt} alt="Receipt" className="w-20 h-20 object-cover" />
                </div>
              )}
              <button
                className="bg-pink text-white p-2 mt-4 rounded"
                onClick={() => deleteExpense(index, expense.source, expense.jobNumber)} // Pass job number for open job expenses
              >
                Delete Expense
              </button>
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
