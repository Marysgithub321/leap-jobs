import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffPayouts = () => {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    date: '',
    name: '',
    description: '',
    amount: '',
    gst: false,
  });
  const [filterName, setFilterName] = useState(''); // State to track name filtering

  const navigate = useNavigate(); // To navigate between pages

  // Load payments from localStorage when the component mounts
  useEffect(() => {
    const savedPayments = JSON.parse(localStorage.getItem('staffPayments')) || [];
    setPayments(savedPayments);
  }, []);

  // Save payments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('staffPayments', JSON.stringify(payments));
  }, [payments]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Add payment
  const addPayment = () => {
    const newPayment = {
      ...paymentForm,
      amount: parseFloat(paymentForm.amount),
      total: paymentForm.gst
        ? parseFloat(paymentForm.amount) * 1.13 // Add 13% GST if applicable
        : parseFloat(paymentForm.amount),
    };
    setPayments([...payments, newPayment]);
    setShowForm(false); // Hide the form after adding the payment
    setPaymentForm({ date: '', name: '', description: '', amount: '', gst: false }); // Reset form
  };

  // Edit payment
  const editPayment = (index) => {
    const paymentToEdit = payments[index];
    setPaymentForm(paymentToEdit); // Pre-fill form with selected payment
    deletePayment(index); // Remove payment so it can be re-added on save
    setShowForm(true); // Show the form for editing
  };

  // Delete payment
  const deletePayment = (index) => {
    const updatedPayments = payments.filter((_, i) => i !== index);
    setPayments(updatedPayments);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Filtered payments by name
  const filteredPayments = payments.filter((payment) =>
    payment.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home and Add Payment buttons */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Payouts</h1>
        </div>
        <div className="flex space-x-4">
          {/* Home button in green color */}
          <button
            className="bg-green text-white p-2 rounded"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          {/* Add Payment button */}
          <button
            className="bg-tealLight text-white p-2 rounded"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Payment'}
          </button>
        </div>
      </header>

      {/* Filter by Name */}
      <div className="mb-4">
        <label htmlFor="filterName" className="block font-bold mb-2">Filter by Name:</label>
        <input
          type="text"
          id="filterName"
          name="filterName"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter contractor name..."
        />
      </div>

      {/* Print Button */}
      <button
        className="bg-green text-white p-2 rounded mb-4"
        onClick={handlePrint}
      >
        Print Payouts
      </button>

      {/* Payment Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
          <div className="mb-4">
            <label htmlFor="date" className="block font-bold mb-2">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={paymentForm.date}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={paymentForm.name}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-bold mb-2">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={paymentForm.description}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block font-bold mb-2">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={paymentForm.amount}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">
              <input
                type="checkbox"
                name="gst"
                checked={paymentForm.gst}
                onChange={handleChange}
                className="mr-2"
              />
              Includes GST?
            </label>
          </div>
          <button
            className="bg-green text-white p-2 rounded"
            onClick={addPayment}
          >
            Add Payment
          </button>
        </div>
      )}

      {/* Payments List */}
      <div className="bg-white p-4 rounded-lg shadow">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <div className="flex justify-between">
                <span>{payment.date}</span>
                <span>{payment.name}</span>
                <span>${payment.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{payment.description}</span>
                <div className="flex space-x-4">
                  <button
                    className="bg-tealLight text-white p-2 rounded"
                    onClick={() => editPayment(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-pink text-white p-2 rounded"
                    onClick={() => deletePayment(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No payments found.</p>
        )}
      </div>
    </div>
  );
};

export default StaffPayouts;
