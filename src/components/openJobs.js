import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OpenJobs = () => {
  const navigate = useNavigate();
  const [openJobs, setOpenJobs] = useState([]);

  // States for new entries
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseReceipt, setNewExpenseReceipt] = useState(null); // State for uploaded receipt image
  const [newExtraType, setNewExtraType] = useState("");
  const [newExtraCost, setNewExtraCost] = useState("");
  const [newPaintType, setNewPaintType] = useState("");
  const [newPaintCost, setNewPaintCost] = useState("");

  // Load open jobs from localStorage on component mount
  useEffect(() => {
    const savedOpenJobs = JSON.parse(localStorage.getItem("openJobs")) || [];
    setOpenJobs(savedOpenJobs);
  }, []);

  // Save jobs to localStorage
  const saveJobs = (updatedJobs) => {
    setOpenJobs(updatedJobs);
    localStorage.setItem("openJobs", JSON.stringify(updatedJobs));
  };

  // Function to delete a job
  const deleteJob = (index) => {
    const updatedJobs = openJobs.filter((_, i) => i !== index);
    saveJobs(updatedJobs);
  };

  // Function to move a job to closed jobs
  const closeJob = (index) => {
    const closedJobs = JSON.parse(localStorage.getItem("closedJobs")) || [];
    closedJobs.push(openJobs[index]);
    localStorage.setItem("closedJobs", JSON.stringify(closedJobs));
    deleteJob(index);
  };

  // Handle receipt image upload
  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewExpenseReceipt(reader.result); // Convert image to Base64 string
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Function to add or update an expense for a specific job
  const addExpense = (jobIndex, description, amount) => {
    if (!description || !amount) return;

    const updatedJobs = [...openJobs];
    const expense = {
      description,
      amount: parseFloat(amount),
      receipt: newExpenseReceipt, // Store the uploaded receipt (Base64 string)
    };
    updatedJobs[jobIndex].expenses = updatedJobs[jobIndex].expenses || [];
    updatedJobs[jobIndex].expenses.push(expense);
    updatedJobs[jobIndex].subtotal += parseFloat(amount);
    saveJobs(updatedJobs);

    // Reset input fields
    setNewExpenseDescription("");
    setNewExpenseAmount("");
    setNewExpenseReceipt(null); // Reset receipt state
  };

  // Function to add an extra
  const addExtra = (jobIndex, type, cost) => {
    if (!type || !cost) return;

    const updatedJobs = [...openJobs];
    const extra = { type, cost: parseFloat(cost) };
    updatedJobs[jobIndex].extras = updatedJobs[jobIndex].extras || [];
    updatedJobs[jobIndex].extras.push(extra);
    updatedJobs[jobIndex].subtotal += parseFloat(cost);
    saveJobs(updatedJobs);

    // Reset input fields
    setNewExtraType("");
    setNewExtraCost("");
  };

  // Function to add a paint
  const addPaint = (jobIndex, type, cost) => {
    if (!type || !cost) return;

    const updatedJobs = [...openJobs];
    const paint = { type, cost: parseFloat(cost) };
    updatedJobs[jobIndex].paints = updatedJobs[jobIndex].paints || [];
    updatedJobs[jobIndex].paints.push(paint);
    updatedJobs[jobIndex].subtotal += parseFloat(cost);
    saveJobs(updatedJobs);

    // Reset input fields
    setNewPaintType("");
    setNewPaintCost("");
  };

  // Function to delete an item (expense, extra, paint)
  const deleteItem = (jobIndex, itemIndex, type) => {
    const updatedJobs = [...openJobs];
    const itemAmount = updatedJobs[jobIndex][type][itemIndex].cost || updatedJobs[jobIndex][type][itemIndex].amount;
    updatedJobs[jobIndex][type].splice(itemIndex, 1);
    updatedJobs[jobIndex].subtotal -= itemAmount;
    saveJobs(updatedJobs);
  };

  // Function to update notes for rooms, extras, or paints
  const updateNote = (jobIndex, itemIndex, type, value) => {
    const updatedJobs = [...openJobs];
    updatedJobs[jobIndex][type][itemIndex].note = value;
    saveJobs(updatedJobs);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Jobs</h1>
        <button
          className="bg-green text-white p-2 rounded"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      {/* Job List */}
      {openJobs.length > 0 ? (
        openJobs.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
            {/* Job Summary */}
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Job #{job.jobNumber}</span>
              <span>{job.customerName}</span>
              <span>{job.date}</span>
            </div>

            {/* Job Details */}
            <div className="mb-4">
              <p>Address: {job.address}</p>
              <p>Phone: {job.phoneNumber}</p>
            </div>

            {/* Room Notes */}
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

            {/* Extra Notes */}
            {job.extras && job.extras.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Extra Notes</h3>
                {job.extras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="mb-2">
                    <p>{extra.type} - ${extra.cost}</p>
                    <textarea
                      className="border p-2 w-full"
                      placeholder="Add note for this extra"
                      value={extra.note || ""}
                      onChange={(e) => updateNote(jobIndex, extraIndex, "extras", e.target.value)}
                    />
                    <button
                      className="bg-pink text-white p-1 rounded mt-2"
                      onClick={() => deleteItem(jobIndex, extraIndex, "extras")}
                    >
                      Delete Extra
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Paint Notes */}
            {job.paints && job.paints.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Paint Notes</h3>
                {job.paints.map((paint, paintIndex) => (
                  <div key={paintIndex} className="mb-2">
                    <p>{paint.type} - ${paint.cost}</p>
                    <textarea
                      className="border p-2 w-full"
                      placeholder="Add note for this paint"
                      value={paint.note || ""}
                      onChange={(e) => updateNote(jobIndex, paintIndex, "paints", e.target.value)}
                    />
                    <button
                      className="bg-pink text-white p-1 rounded mt-2"
                      onClick={() => deleteItem(jobIndex, paintIndex, "paints")}
                    >
                      Delete Paint
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Expense List */}
            <div className="mb-4">
              <h3 className="font-semibold">Expenses</h3>
              {job.expenses && job.expenses.length > 0 ? (
                job.expenses.map((expense, expenseIndex) => (
                  <div key={expenseIndex} className="flex justify-between mb-2">
                    <div>
                      <span>{expense.description}</span>
                      <span className="ml-4">${expense.amount.toFixed(2)}</span>
                      {expense.receipt && (
                        <img
                          src={expense.receipt}
                          alt="Receipt"
                          className="w-20 h-20 object-cover mt-2"
                        />
                      )}
                    </div>
                    <button
                      className="bg-pink text-white p-1 rounded"
                      onClick={() => deleteItem(jobIndex, expenseIndex, "expenses")}
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
              <input
                type="file"
                accept="image/*"
                className="border p-2 w-full mb-2"
                onChange={handleReceiptUpload} // Handle receipt upload
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
                onClick={() => navigate("/estimate-calculator", { state: { job, jobIndex } })}
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
          </div>
        ))
      ) : (
        <p>No open jobs found</p>
      )}
    </div>
  );
};

export default OpenJobs;
