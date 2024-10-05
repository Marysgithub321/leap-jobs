import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    jobNumber: "",
    description: "",
    amount: "",
    receipt: null,
  });
  const [filterJobNumber, setFilterJobNumber] = useState(""); // Only filter by job number

  // Load all expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("directExpenses")) || [];
    setExpenses(savedExpenses);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("directExpenses", JSON.stringify(expenses));
  }, [expenses]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input for receipt upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewExpense((prev) => ({
        ...prev,
        receipt: reader.result, // Save the file as Base64 string
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Add new expense
  const addExpense = () => {
    const newExpenseEntry = {
      ...newExpense,
      amount: parseFloat(newExpense.amount),
    };

    setExpenses([...expenses, newExpenseEntry]);
    setShowForm(false); // Hide form after adding expense

    // Reset form
    setNewExpense({
      jobNumber: "",
      description: "",
      amount: "",
      receipt: null,
    });
  };

  // Edit expense
  const editExpense = (index) => {
    const expenseToEdit = expenses[index];
    setNewExpense(expenseToEdit);
    deleteExpense(index);
    setShowForm(true); // Show form for editing
  };

  // Delete expense
  const deleteExpense = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  // Filter expenses by job number only
  const filteredExpenses = expenses.filter((expense) => {
    return expense.jobNumber.toLowerCase().includes(filterJobNumber.toLowerCase());
  });

  // Generate PDF
  const handlePrintExpenses = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text("Expense Report", 10, 10);

    filteredExpenses.forEach((expense, index) => {
      const line = `Job #${expense.jobNumber} | ${expense.description} | $${expense.amount.toFixed(2)}`;
      doc.text(line, 10, 20 + index * 10);
    });

    doc.save("expenses_report.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home and Add Expense buttons */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
        </div>
        <div className="flex space-x-4">
          {/* Home button */}
          <button
            className="bg-green text-white p-2 rounded"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </header>

      {/* Filter Section */}
      <div className="mb-4">
        <label htmlFor="filterJobNumber" className="block font-bold mb-2">
          Filter by Job Number:
        </label>
        <input
          type="text"
          id="filterJobNumber"
          value={filterJobNumber}
          onChange={(e) => setFilterJobNumber(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter job number..."
        />
      </div>

      {/* Print Button */}
      <button
        className="bg-blue text-white p-2 rounded mb-4 mr-4"
        onClick={handlePrintExpenses}
      >
        Download Expense Report (PDF)
      </button>

      {/* Add Expense button */}
      <button
        className="bg-darkBlue text-white p-2 rounded mt-4 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Expense"}
      </button>

      {/* Expense Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="jobNumber" className="block font-bold mb-2">
              Job Number
            </label>
            <input
              type="text"
              id="jobNumber"
              name="jobNumber"
              value={newExpense.jobNumber}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={newExpense.description}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newExpense.amount}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="receipt" className="block font-bold mb-2">
              Receipt (optional)
            </label>
            <input
              type="file"
              id="receipt"
              accept="image/*"
              onChange={handleReceiptUpload}
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            className="bg-green text-white p-2 rounded"
            onClick={addExpense}
          >
            Save Expense
          </button>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white p-4 rounded-lg shadow">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <div className="flex justify-between">
                <span>Job #{expense.jobNumber}</span>
                <span>${expense.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{expense.description}</span>
                <div className="flex space-x-4">
                  <button
                    className="bg-tealLight text-white p-2 rounded"
                    onClick={() => editExpense(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-pink text-white p-2 rounded"
                    onClick={() => deleteExpense(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Display the uploaded receipt image */}
              {expense.receipt && (
                <div className="mt-2">
                  <p>Receipt:</p>
                  <img
                    src={expense.receipt}
                    alt="Receipt"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default Expenses;
