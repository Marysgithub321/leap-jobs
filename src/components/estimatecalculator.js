import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getNextAvailableNumber } from "../utils"; // Assuming utils.js is directly in the src folder

const EstimateCalculator = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract job or estimate from location.state
  const initialData = location.state?.job || location.state?.estimate || {};

  // Initialize form state with data from job or estimate
  const [customerName, setCustomerName] = useState(initialData.customerName || "");
  const [estimateNumber, setEstimateNumber] = useState(initialData.estimateNumber || "");
  const [date, setDate] = useState(initialData.date || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || "");
  const [rooms, setRooms] = useState(initialData.rooms || []);
  const [extras, setExtras] = useState(initialData.extras || []);
  const [total, setTotal] = useState(initialData.total || 0);
  const [gstHst, setGstHst] = useState(initialData.gstHst || 0);
  const [editPrices, setEditPrices] = useState(false); // For price editing
  const [description, setDescription] = useState(initialData.description || "");
  const [customDescription, setCustomDescription] = useState(initialData.customDescription || "");

  // Default cost options
  const defaultCostOptions = [
    { label: "Square Footage", value: 3.0 },
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
    { label: "Just trim and doors", value: 150 },
    { label: "Painting Stairs", value: 125 },
    { label: "Staining Stairs", value: 500 },
    { label: "Matching Stain to floor", value: 600 },
    { label: "Staining Beam", value: 250 },
    { label: "Painting Railing", value: 450 },
    { label: "Staining Railing", value: 550 },
    { label: "Other", value: 50 },
  ];

  // Load cost options from localStorage using a different key ("estimateCostOptions")
  const [costOptions, setCostOptions] = useState(() => {
    const savedCostOptions =
      JSON.parse(localStorage.getItem("estimateCostOptions")) || [];
    const mergedOptions = [...defaultCostOptions];

    // Merge saved options with default options
    savedCostOptions.forEach((savedOption) => {
      const index = mergedOptions.findIndex(
        (opt) => opt.label === savedOption.label
      );
      if (index !== -1) {
        mergedOptions[index].value = savedOption.value; // Update existing options
      } else {
        mergedOptions.push(savedOption); // Add new options
      }
    });

    return mergedOptions;
  });

  const extraOptions = ["Paint", "Stain", "Primer", "Travel", "Other"];
  const roomOptions = [
    "Square Footage",
    "Front Entry",
    "Living Room",
    "Kitchen",
    "Dining Room",
    "Hall",
    "Master Bedroom",
    "Master Bath",
    "Walk-in closet",
    "Bedroom 2",
    "Bedroom 3",
    "Main Bath",
    "Office",
    "Nursery",
    "Stairway",
    "Play Room",
    "Laundry Room",
    "Rec Room",
    "Bedroom 4",
    "Bedroom 5",
    "Downstairs Bath",
    "Upstairs Bath",
    "Half Bath",
    "Garage",
    "Beam",
    "Railing",
    "Extra Room",
    "Stairs",
    "Sun Room",
    "Closet",
  ];

  // Auto-generate the next estimate number if not editing
  useEffect(() => {
    if (!estimateNumber) {
      const estimates = JSON.parse(localStorage.getItem("estimates")) || [];
      const openJobs = JSON.parse(localStorage.getItem("openJobs")) || [];
      const closedJobs = JSON.parse(localStorage.getItem("closedJobs")) || [];
      const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

      // Generate the next available estimate number
      const nextEstimateNumber = getNextAvailableNumber(
        [...estimates, ...openJobs, ...closedJobs, ...invoices],
        "estimateNumber"
      );

      setEstimateNumber(nextEstimateNumber); // Set the next available estimate number
    }
  }, [estimateNumber]);

  // Calculate total when rooms, extras, or paints change
  const calculateTotal = useCallback(() => {
    const roomsTotal = rooms.reduce((acc, room) => {
      if (room.roomName === "Square Footage") {
        const squareFootagePrice =
          costOptions.find((option) => option.label === "Square Footage")?.value || 0;
        return acc + (room.squareFootage * squareFootagePrice || 0);
      } else {
        return acc + parseFloat(room.cost || 0);
      }
    }, 0);

    const extrasTotal = extras.reduce(
      (acc, extra) => acc + parseFloat(extra.cost || 0),
      0
    );

    const subtotal = roomsTotal + extrasTotal;
    setTotal(subtotal);
    setGstHst(subtotal * 0.13); // Assuming 13% GST/HST
  }, [rooms, extras, costOptions]);

  // Automatically calculate total when inputs change
  useEffect(() => {
    calculateTotal();
  }, [rooms, extras, calculateTotal]);

  // Add Room Handler
  const addRoom = () =>
    setRooms([
      ...rooms,
      { roomName: "", customRoomName: "", cost: 0, customCost: false, squareFootage: 0 }, // Include squareFootage property
    ]);

  // Add Extra Handler
  const addExtra = () =>
    setExtras([...extras, { type: "", customType: "", cost: 0 }]);

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

  // Toggle Edit Prices
  const toggleEditPrices = () => setEditPrices(!editPrices);

  // Remove Handlers
  const removeRoom = (index) => setRooms(rooms.filter((_, i) => i !== index));
  const removeExtra = (index) =>
    setExtras(extras.filter((_, i) => i !== index));

  // Function to save the edited prices to localStorage
  const savePrices = () => {
    localStorage.setItem("estimateCostOptions", JSON.stringify(costOptions));
    setEditPrices(false); // Close the edit section/modal
    calculateTotal(); // Recalculate totals after price update
  };

  // Function to save the estimate to localStorage
  const saveEstimate = () => {
    const gstHst = total * 0.13; // 13% GST/HST calculation

    const updatedEstimate = {
      customerName,
      estimateNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      subtotal: total, // Save the calculated subtotal
      gstHst, // Save the calculated GST/HST
      total: total + gstHst, // Total including GST/HST
      description, // Save the selected description
      customDescription, // Save the custom description if entered
    };

    // Update Estimates
    const estimates = JSON.parse(localStorage.getItem("estimates")) || [];
    const estimateIndex = estimates.findIndex(
      (estimate) => estimate.estimateNumber === estimateNumber
    );

    if (estimateIndex !== -1) {
      estimates[estimateIndex] = updatedEstimate;
    } else {
      estimates.push(updatedEstimate);
    }

    localStorage.setItem("estimates", JSON.stringify(estimates));
    navigate("/estimates"); // Redirect to the estimates page
  };

  // Function to add the estimate as an open job
  const openJob = () => {
    const gstHst = total * 0.13; // 13% GST/HST calculation

    const updatedEstimate = {
      customerName,
      estimateNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      subtotal: total,
      gstHst,
      total: total + gstHst,
      description, // Save the selected description
      customDescription, // Save the custom description if entered
    };

    const openJobs = JSON.parse(localStorage.getItem("openJobs")) || [];
    const openJobIndex = openJobs.findIndex(
      (job) => job.estimateNumber === estimateNumber
    );

    if (openJobIndex !== -1) {
      openJobs[openJobIndex] = updatedEstimate;
    } else {
      openJobs.push(updatedEstimate);
    }

    localStorage.setItem("openJobs", JSON.stringify(openJobs));
    navigate("/open-jobs"); // Redirect to the open jobs page
  };

  // Add description options
  const descriptionOptions = [
    "Includes all labor and paint",
    "Includes labor, paint is extra",
    "Other", // Custom option
  ];

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
          {/* Date and Estimate Number */}
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
                <label
                  htmlFor="estimateNumber"
                  className="block text-sm font-bold"
                >
                  Estimate Number:
                </label>
                <input
                  type="text"
                  id="estimateNumber"
                  className="border rounded p-2 w-20"
                  value={estimateNumber}
                  onChange={(e) => setEstimateNumber(e.target.value)} // Allow manual override
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
              Add Extra/Paint
            </button>

            <button
              className="bg-blue text-white p-2 rounded w-full sm:w-auto"
              onClick={toggleEditPrices}
            >
              {editPrices ? "Close Edit Prices" : "Edit Prices"}
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
                      const newValue = parseFloat(e.target.value) || 0; // Ensure it's a valid number
                      const updatedOptions = costOptions.map((item, i) =>
                        i === index ? { ...item, value: newValue } : item
                      );
                      setCostOptions(updatedOptions); // Update state immutably
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

          {/* Description Section */}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description:</label>
            <select
              className="border p-2 w-full mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
              <option value="">Select Description</option>
              {descriptionOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Display custom input if 'Other' is selected */}
            {description === "Other" && (
              <input
                type="text"
                className="border p-2 mb-2 w-full"
                placeholder="Enter custom description"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
              />
            )}
          </div>

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
                      if (value === "Square Footage") {
                        updateRoom(index, "squareFootage", 0); // Reset square footage
                      } else {
                        updateRoom(index, "cost", 0); // Reset cost for non-square footage rooms
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

                  {/* Square Footage Input */}
                  {room.roomName === "Square Footage" && (
                    <div>
                      <label htmlFor="squareFootage">
                        Enter Square Footage:
                      </label>
                      <input
                        type="number"
                        className="border p-2 mb-2 w-full"
                        value={room.squareFootage}
                        onChange={(e) =>
                          updateRoom(index, "squareFootage", e.target.value)
                        }
                      />
                    </div>
                  )}

                  {/* Cost Input for Regular Rooms */}
                  {room.roomName !== "Square Footage" && (
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
                  )}

                  <button
                    onClick={() => removeRoom(index)}
                    className="bg-pink text-white p-2 rounded hover:bg-darkGray w-full mt-2"
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
                    className="bg-pink text-white p-2 rounded hover:bg-darkGray w-full mt-2"
                  >
                    Remove Extra
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
