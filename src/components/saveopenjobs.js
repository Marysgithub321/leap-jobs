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
  const [newDescription, setNewDescription] = useState("");
  const [newCustomDescription, setNewCustomDescription] = useState("");

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

  // Function to add a description
  const addDescription = (jobIndex, description, customDescription) => {
    if (!description) return;

    const updatedJobs = [...openJobs];
    const finalDescription =
      description === "Other" ? customDescription : description;

    updatedJobs[jobIndex].description = finalDescription;
    saveJobs(updatedJobs); // Save updated jobs to storage or state

    // Reset input fields
    setNewDescription("");
    setNewCustomDescription("");
  };

  // Function to delete an item (expense, extra, description)
  const deleteItem = (jobIndex, itemIndex, type) => {
    const updatedJobs = [...openJobs];
    const itemAmount =
      updatedJobs[jobIndex][type][itemIndex]?.cost ||
      updatedJobs[jobIndex][type][itemIndex]?.amount ||
      0;
    if (itemIndex !== null) {
      updatedJobs[jobIndex][type].splice(itemIndex, 1);
    } else {
      updatedJobs[jobIndex][type] = ""; // Clear the description
    }
    updatedJobs[jobIndex].subtotal -= itemAmount;
    saveJobs(updatedJobs);
  };

  // Function to update notes for rooms, extras, or description
  const updateNote = (jobIndex, itemIndex, type, value) => {
    const updatedJobs = [...openJobs];
    if (type === "customDescription") {
      updatedJobs[jobIndex].customDescription = value; // Update custom description
    } else {
      updatedJobs[jobIndex][type][itemIndex].note = value;
    }
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
          <div
            key={jobIndex}
            className="mb-6 p-4 bg-gray-100 rounded-lg shadow"
          >
            {/* Job Summary */}
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Job #{job.estimateNumber}</span>
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
                  <p>
                    {room.roomName} - {room.cost}
                  </p>
                  <textarea
                    className="border p-2 w-full"
                    placeholder="Add note for this room"
                    value={room.note || ""}
                    onChange={(e) =>
                      updateNote(jobIndex, roomIndex, "rooms", e.target.value)
                    }
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
                    <p>
                      {extra.type} - ${extra.cost}
                    </p>
                    <textarea
                      className="border p-2 w-full"
                      placeholder="Add note for this extra"
                      value={extra.note || ""}
                      onChange={(e) =>
                        updateNote(jobIndex, extraIndex, "extras", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-blue text-white p-2 rounded"
                onClick={() =>
                  navigate("/estimate-calculator", { state: { job, jobIndex } })
                }
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
