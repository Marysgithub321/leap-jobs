import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { jsPDF } from 'jspdf'; // Import jsPDF library

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  // Load saved invoices from localStorage
  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    setInvoices(savedInvoices);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate('/')} // Navigate back to the home/dashboard route
        >
          Home
        </button>
      </header>

      {invoices.length > 0 ? (
        invoices.map((invoice, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <p>Job Number: {invoice.jobNumber}</p>
            <p>Customer Name: {invoice.customerName}</p>
            <p>Total: ${invoice.total.toFixed(2)}</p>

            {/* Button to re-generate and download the PDF */}
            <button
              className="bg-darkBlue text-white p-2 mt-4 rounded"
              onClick={() => {
                const doc = new jsPDF();
                doc.text('Invoice', 10, 10);
                doc.text(`Job Number: ${invoice.jobNumber}`, 10, 30);
                doc.text(`Customer Name: ${invoice.customerName}`, 10, 40);
                doc.text(`Total: $${invoice.total.toFixed(2)}`, 10, 50);
                doc.save(`Invoice_${invoice.jobNumber}.pdf`);
              }}
            >
              Download PDF
            </button>
          </div>
        ))
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
};

export default Invoices;
