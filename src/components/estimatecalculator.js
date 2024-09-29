import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const EstimateCalculator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract both job and estimate data from location.state (whichever exists)
  const initialData = location.state?.job || location.state?.estimate || {};

  // Initialize form state with either job or estimate
  const [customerName, setCustomerName] = useState(initialData.customerName || "");
  const [jobNumber, setJobNumber] = useState(initialData.jobNumber || "");
  const [date, setDate] = useState(initialData.date || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || "");
  const [rooms, setRooms] = useState(initialData.rooms || []);
  const [extras, setExtras] = useState(initialData.extras || []);
  const [paints, setPaints] = useState(initialData.paints || []);
  const [total, setTotal] = useState(initialData.total || 0);
  const [gstHst, setGstHst] = useState(initialData.gstHst || 0);
  const [editPrices, setEditPrices] = useState(false); // For price editing

  // Load room prices from localStorage (if available) or use default cost options
  const [costOptions, setCostOptions] = useState(
    JSON.parse(localStorage.getItem("costOptions")) || [
      { label: "8ft ceiling walls trim and doors", value: 350 },
      { label: "9ft ceiling walls trim and doors", value: 400 },
      { label: "10ft ceiling walls trim and doors", value: 450 },
      { label: "Vaulted ceiling", value: 600 },
      { label: "8ft walls and ceilings", value: 275 },
      { label: "9ft walls and ceilings", value: 325 },
      { label: "10ft walls and ceilings", value: 385 },
      { label: "8ft walls", value: 225 },
      { label: "9ft walls", value: 275 },
      { label: "10ft walls", value: 325 },
      { label: "Just ceiling", value: 150 },
      { label: "Just trim and doors", value: 125 },
    ]
  );

  const extraOptions = ["Stairs - Stain or Paint", "Railings", "Other"];
  const paintOptions = ["Primer", "Paint", "Stain", "Other"];
  const roomOptions = [
    "Kitchen",
    "Master Bedroom",
    "Walk-in closet",
    "Bedroom 2",
    "Bedroom 3",
    "Bedroom 4",
    "Bedroom 5",
    "Office",
    "Nursery",
    "Play Room",
    "Laundry Room",
    "Living Room",
    "Rec Room",
    "Hall",
    "Stairway",
    "Master Bath",
    "Main Bath",
    "Downstairs Bath",
    "Upstairs Bath",
    "Half Bath",
    "Front Entry",
    "Garage",
    "Dining Room",
    "Extra Room",
  ];

  // Auto-generate the next job number if not editing
  useEffect(() => {
    if (!jobNumber) {
      const estimates = JSON.parse(localStorage.getItem("estimates")) || [];
      const openJobs = JSON.parse(localStorage.getItem("openJobs")) || [];

      const allJobs = [...estimates, ...openJobs];
      const jobNumbers = allJobs.map((job) => parseInt(job.jobNumber, 10));

      const maxJobNumber = jobNumbers.length > 0 ? Math.max(...jobNumbers) : 0;
      const nextJobNumber = (maxJobNumber + 1).toString().padStart(2, '0');

      setJobNumber(nextJobNumber); // Set the next available job number
    }
  }, [jobNumber]);

  // Calculate total when rooms, extras, or paints change
  const calculateTotal = useCallback(() => {
    const roomsTotal = rooms.reduce(
      (acc, room) => acc + parseFloat(room.cost || 0),
      0
    );
    const extrasTotal = extras.reduce(
      (acc, extra) => acc + parseFloat(extra.cost || 0),
      0
    );
    const paintsTotal = paints.reduce(
      (acc, paint) => acc + parseFloat(paint.cost || 0),
      0
    );
    const subtotal = roomsTotal + extrasTotal + paintsTotal;
    setTotal(subtotal);
    setGstHst(subtotal * 0.13); // Assuming 13% GST/HST
  }, [rooms, extras, paints]);

  // Automatically calculate total when inputs change
  useEffect(() => {
    calculateTotal();
  }, [rooms, extras, paints, calculateTotal]);

  // Add Room Handler
  const addRoom = () =>
    setRooms([
      ...rooms,
      { roomName: "", customRoomName: "", cost: 0, customCost: false },
    ]);

  // Add Extra Handler
  const addExtra = () =>
    setExtras([...extras, { type: "", customType: "", cost: 0 }]);

  // Add Paint Handler
  const addPaint = () =>
    setPaints([...paints, { type: "", customType: "", cost: 0 }]);

  // Update Room Handler
  const updateRoom = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  // Update Extra Handler
  const updateExtra = (index, field, value) => {
    const updatedExtras = [...extras];
    updatedExtras[index][field] = value;
    setExtras(updatedExtras);
  };

  // Update Paint Handler
  const updatePaint = (index, field, value) => {
    const updatedPaints = [...paints];
    updatedPaints[index][field] = value;
    setPaints(updatedPaints);
  };

  // Toggle Edit Prices
  const toggleEditPrices = () => setEditPrices(!editPrices);

  // Remove Handlers
  const removeRoom = (index) => setRooms(rooms.filter((_, i) => i !== index));
  const removeExtra = (index) =>
    setExtras(extras.filter((_, i) => i !== index));
  const removePaint = (index) =>
    setPaints(paints.filter((_, i) => i !== index));

  // Function to save the edited prices to localStorage
  const savePrices = () => {
    localStorage.setItem("costOptions", JSON.stringify(costOptions));
    setEditPrices(false); // Close the edit section/modal
  };

  // Function to save the estimate to localStorage
  const saveEstimate = () => {
    const gstHst = total * 0.13; // 13% GST/HST calculation

    const updatedEstimate = {
      customerName,
      jobNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      paints,
      subtotal: total, // Save the calculated subtotal
      gstHst, // Save the calculated GST/HST
      total: total + gstHst, // Total including GST/HST
    };

    // Update Estimates
    const estimates = JSON.parse(localStorage.getItem("estimates")) || [];
    const estimateIndex = estimates.findIndex(
      (estimate) => estimate.jobNumber === jobNumber
    );

    if (estimateIndex !== -1) {
      estimates[estimateIndex] = updatedEstimate;
    } else {
      estimates.push(updatedEstimate);
    }

    localStorage.setItem("estimates", JSON.stringify(estimates));

    // Redirect to the estimates page
    navigate("/estimates");
  };

  // Function to add the estimate as an open job
  const openJob = () => {
    const gstHst = total * 0.13; // 13% GST/HST calculation

    const updatedEstimate = {
      customerName,
      jobNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      paints,
      subtotal: total, // Save the calculated subtotal
      gstHst, // Save the calculated GST/HST
      total: total + gstHst, // Total including GST/HST
    };

    // Update Open Jobs
    const openJobs = JSON.parse(localStorage.getItem("openJobs")) || [];
    const openJobIndex = openJobs.findIndex(
      (job) => job.jobNumber === jobNumber
    );

    if (openJobIndex !== -1) {
      openJobs[openJobIndex] = updatedEstimate; // Update the existing job
    } else {
      openJobs.push(updatedEstimate);
    }

    localStorage.setItem("openJobs", JSON.stringify(openJobs));

    // Redirect to the open jobs page
    navigate("/open-jobs");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Paint Job Estimator
        </h1>
        <button
          onClick={() => navigate("/")}
          className="bg-green text-white p-2 rounded hover:bg-gray-600"
        >
          Home
        </button>
      </header>

      {/* Main Form */}
      <main className="card-container">
        <div className="card p-4 bg-gray-100 rounded-lg">
          {/* Date and Job Number */}
          <section className="date flex space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-bold">
                Date:
              </label>
              <input
                type="date"
                id="date"
                className="border rounded w-full p-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <div>
                <label htmlFor="jobNumber" className="block text-sm font-bold">
                  Job Number:
                </label>
                <input
                  type="text"
                  id="jobNumber"
                  className="border rounded p-2 w-20"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)} // Allow manual override
                  required
                />
              </div>
            </div>
          </section>

          {/* Customer Information */}
          <div className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4">
            <h2 className="text-lg font-bold mb-4">Customer Information</h2>
            <section className="CustomerInfo space-y-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-bold"
                >
                  Customer Name:
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="border rounded w-full p-2"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-bold"
                >
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="border rounded w-full p-2"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-bold">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  className="border rounded w-full p-2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </section>
          </div>

          {/* Buttons for Adding Sections */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className="bg-darkBlue text-white p-2 rounded w-full sm:w-auto"
              onClick={addRoom}
            >
              Add Room
            </button>
            <button
              className="bg-tealLight text-white p-2 rounded w-full sm:w-auto"
              onClick={addExtra}
            >
              Add Extra
            </button>
            <button
              className="bg-pink text-white p-2 rounded w-full sm:w-auto"
              onClick={addPaint}
            >
              Add Paint
            </button>
            <button
              className="bg-blue text-white p-2 rounded w-full sm:w-auto"
              onClick={toggleEditPrices}
            >
              Edit Prices
            </button>
          </div>

          {/* Edit Prices Section */}
          {editPrices && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold mb-2">Edit Room Prices</h3>
              {costOptions.map((option, index) => (
                <div key={index} className="mb-2">
                  <label className="block text-sm font-bold">
                    {option.label}:
                  </label>
                  <input
                    type="number"
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = [...costOptions];
                      updatedOptions[index].value = parseFloat(e.target.value);
                      setCostOptions(updatedOptions);
                    }}
                    className="border rounded w-full p-2"
                  />
                </div>
              ))}
              <button
                className="bg-pink text-white p-2 mt-4 rounded w-full"
                onClick={savePrices}
              >
                Save Prices
              </button>
            </div>
          )}

          {/* Display added Rooms, Extras, and Paints */}
          {rooms.length > 0 && (
            <>
              <h3 className="font-bold mb-2">Rooms</h3>
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4"
                >
                  <select
                    className="border p-2 mb-2 w-full"
                    value={room.roomName}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateRoom(index, "roomName", value);
                      if (value === "Extra Room") {
                        updateRoom(index, "customRoomName", "");
                      }
                    }}
                  >
                    <option value="">Select Room</option>
                    {roomOptions.map((roomName, i) => (
                      <option key={i} value={roomName}>
                        {roomName}
                      </option>
                    ))}
                  </select>

                  {/* Custom Room Name Input */}
                  {room.roomName === "Extra Room" && (
                    <input
                      type="text"
                      className="border p-2 mb-2 w-full"
                      placeholder="Enter custom room name"
                      value={room.customRoomName}
                      onChange={(e) =>
                        updateRoom(index, "customRoomName", e.target.value)
                      }
                    />
                  )}

                  {/* Cost Input */}
                  <select
                    className="border p-2 mb-2 w-full"
                    value={room.cost}
                    onChange={(e) =>
                      updateRoom(index, "cost", parseFloat(e.target.value))
                    }
                  >
                    <option value="">Select Cost</option>
                    {costOptions.map((option, i) => (
                      <option key={i} value={option.value}>
                        {option.label} - ${option.value}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeRoom(index)}
                    className="bg-blue text-white p-2 rounded hover:bg-darkGray w-full mt-2"
                  >
                    Remove Room
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Display added Extras */}
          {extras.length > 0 && (
            <>
              <h3 className="font-bold mb-2">Extras</h3>
              {extras.map((extra, index) => (
                <div
                  key={index}
                  className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4"
                >
                  <select
                    className="border p-2 mb-2 w-full"
                    value={extra.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateExtra(index, "type", value);
                      if (value === "Other") {
                        updateExtra(index, "customType", "");
                      }
                    }}
                  >
                    <option value="">Select Extra</option>
                    {extraOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Custom Extra Type Input */}
                  {extra.type === "Other" && (
                    <input
                      type="text"
                      className="border p-2 mb-2 w-full"
                      placeholder="Enter custom extra"
                      value={extra.customType}
                      onChange={(e) =>
                        updateExtra(index, "customType", e.target.value)
                      }
                    />
                  )}

                  {/* Manually enter cost */}
                  <input
                    type="number"
                    className="border p-2 mb-2 w-full"
                    placeholder="Cost"
                    value={extra.cost}
                    onChange={(e) => updateExtra(index, "cost", e.target.value)}
                  />

                  <button
                    onClick={() => removeExtra(index)}
                    className="bg-tealLight text-white p-2 rounded hover:bg-darkGray w-full mt-2"
                  >
                    Remove Extra
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Display added Paints */}
          {paints.length > 0 && (
            <>
              <h3 className="font-bold mb-2">Paints</h3>
              {paints.map((paint, index) => (
                <div
                  key={index}
                  className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4"
                >
                  <select
                    className="border p-2 mb-2 w-full"
                    value={paint.type}
                    onChange={(e) => {
                      const value = e.target.value;
                      updatePaint(index, "type", value);
                      if (value === "Other") {
                        updatePaint(index, "customType", "");
                      }
                    }}
                  >
                    <option value="">Select Paint Type</option>
                    {paintOptions.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Custom Paint Type Input */}
                  {paint.type === "Other" && (
                    <input
                      type="text"
                      className="border p-2 mb-2 w-full"
                      placeholder="Enter custom paint type"
                      value={paint.customType}
                      onChange={(e) =>
                        updatePaint(index, "customType", e.target.value)
                      }
                    />
                  )}

                  {/* Manually enter cost */}
                  <input
                    type="number"
                    className="border p-2 mb-2 w-full"
                    placeholder="Cost"
                    value={paint.cost}
                    onChange={(e) =>
                      updatePaint(index, "cost", e.target.value)
                    }
                  />

                  <button
                    onClick={() => removePaint(index)}
                    className="bg-darkBlue text-white p-2 rounded hover:bg-darkGray w-full mt-2"
                  >
                    Remove Paint
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Subtotals and Totals */}
          <div className="section-bordered border-t mt-4 pt-4">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>GST/HST (13%):</p>
              <p>${gstHst.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>${(total + gstHst).toFixed(2)}</p>
            </div>
          </div>

          {/* Save Estimate and Open Job Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              className="bg-green text-white p-2 w-full sm:w-auto rounded"
              onClick={saveEstimate}
            >
              Save Estimate
            </button>
            <button
              className="bg-blue text-white p-2 w-full sm:w-auto rounded"
              onClick={openJob}
            >
              Open Job
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EstimateCalculator;
