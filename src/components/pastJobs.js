import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PastJobs = () => {
  const [closedJobs, setClosedJobs] = useState([]);
  const navigate = useNavigate();

  // Load closed jobs from localStorage on component mount
  useEffect(() => {
    const savedClosedJobs =
      JSON.parse(localStorage.getItem("closedJobs")) || [];
    setClosedJobs(savedClosedJobs);
  }, []);

  // Function to delete a closed job
  const handleDelete = (jobIndex) => {
    const updatedJobs = closedJobs.filter((_, index) => index !== jobIndex);
    setClosedJobs(updatedJobs);
    localStorage.setItem("closedJobs", JSON.stringify(updatedJobs));
  };

  // Function to save the job as an invoice
  const saveAsInvoice = (job) => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    savedInvoices.push(job);
    localStorage.setItem("invoices", JSON.stringify(savedInvoices));
    alert("Invoice created successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Closed Jobs</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      {closedJobs.length > 0 ? (
        closedJobs.map((job, jobIndex) => (
          <div
            key={jobIndex}
            className="mb-6 p-4 bg-gray-100 rounded-lg shadow"
          >
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Job #{job.jobNumber}</span>
              <span>{job.customerName}</span>
              <span>{job.date}</span>
            </div>

            <div className="mb-4">
              <p>Address: {job.address}</p>
              <p>Phone: {job.phoneNumber}</p>
            </div>

            {/* Display Room details */}
            <div className="mb-4">
              <h3 className="font-semibold">Rooms</h3>
              {job.rooms &&
                job.rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className="mb-2">
                    <p>Room: {room.roomName}</p>
                    <p>Cost: ${room.cost}</p>
                    <p>Notes: {room.note || "No notes"}</p>
                  </div>
                ))}
            </div>

            {/* Display Extra details */}
            {job.extras && job.extras.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Extras</h3>
                {job.extras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="mb-2">
                    <p>Extra: {extra.type}</p>
                    <p>Cost: ${extra.cost}</p>
                    <p>Notes: {extra.note || "No notes"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Display Paint details */}
            {job.paints && job.paints.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Paints</h3>
                {job.paints.map((paint, paintIndex) => (
                  <div key={paintIndex} className="mb-2">
                    <p>Paint: {paint.type}</p>
                    <p>Cost: ${paint.cost}</p>
                    <p>Notes: {paint.note || "No notes"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Display Expense details */}
            <div className="mb-4">
              <h3 className="font-semibold">Expenses</h3>
              {job.expenses &&
                job.expenses.map((expense, expenseIndex) => (
                  <div key={expenseIndex} className="mb-2">
                    <p>Expense: {expense.description}</p>
                    <p>Cost: ${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
            </div>

            {/* Totals */}
            <div className="section-bordered border-t mt-4 pt-4">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${job.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>GST/HST (13%):</p>
                <p>${(job.subtotal * 0.13).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>${(job.subtotal * 1.13).toFixed(2)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-darkBlue text-white p-2 rounded"
                onClick={() => saveAsInvoice(job)} // Save the job as an invoice
              >
                Create Invoice
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => handleDelete(jobIndex)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No closed jobs found</p>
      )}
    </div>
  );
};

export default PastJobs;
