import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EstimateCalculator = () => {
  const location = useLocation(); // To get passed state for editing
  const navigate = useNavigate(); // To navigate between pages

  // Initialize form state (pre-populate with location.state if editing an estimate)
  const [customerName, setCustomerName] = useState(location.state?.estimate?.customerName || '');
  const [jobNumber, setJobNumber] = useState(location.state?.estimate?.jobNumber || '');
  const [date, setDate] = useState(location.state?.estimate?.date || '');
  const [address, setAddress] = useState(location.state?.estimate?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(location.state?.estimate?.phoneNumber || '');
  const [rooms, setRooms] = useState(location.state?.estimate?.rooms || []);
  const [extras, setExtras] = useState(location.state?.estimate?.extras || []);
  const [paints, setPaints] = useState(location.state?.estimate?.paints || []);
  const [total, setTotal] = useState(location.state?.estimate?.total || 0);
  const [gstHst, setGstHst] = useState(location.state?.estimate?.gstHst || 0);
  const [editPrices, setEditPrices] = useState(false); // For price editing

  // Room cost options
  const [costOptions, setCostOptions] = useState([
    { label: '8ft ceiling walls trim and doors', value: 350 },
    { label: '9ft ceiling walls trim and doors', value: 400 },
    { label: '10ft ceiling walls trim and doors', value: 450 },
    { label: 'Vaulted ceiling', value: 600 },
    { label: '8ft walls and ceilings', value: 275 },
    { label: '9ft walls and ceilings', value: 325 },
    { label: '10ft walls and ceilings', value: 385 },
    { label: '8ft walls', value: 225 },
    { label: '9ft walls', value: 275 },
    { label: '10ft walls', value: 325 },
    { label: 'Just ceiling', value: 150 },
    { label: 'Just trim and doors', value: 125 }
  ]);

  const roomOptions = [
    'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bedroom 3', 'Bedroom 4', 'Bedroom 5', 'Office', 'Nursery',
    'Play Room', 'Laundry Room', 'Living Room', 'Rec Room', 'Hall', 'Stairway', 'Master Bath', 'Main Bath',
    'Downstairs Bath', 'Upstairs Bath', 'Half Bath', 'Front Entry', 'Garage', 'Dining Room', 'Extra Room'
  ];

  // Calculate total when rooms, extras, or paints change
  const calculateTotal = useCallback(() => {
    const roomsTotal = rooms.reduce((acc, room) => acc + parseFloat(room.cost || 0), 0);
    const extrasTotal = extras.reduce((acc, extra) => acc + parseFloat(extra.cost || 0), 0);
    const paintsTotal = paints.reduce((acc, paint) => acc + parseFloat(paint.cost || 0), 0);
    const subtotal = roomsTotal + extrasTotal + paintsTotal;
    setTotal(subtotal);
    setGstHst(subtotal * 0.13); // Assuming 13% GST/HST
  }, [rooms, extras, paints]);

  // Automatically calculate total when inputs change
  useEffect(() => {
    calculateTotal();
  }, [rooms, extras, paints, calculateTotal]);

  // Save estimate to localStorage
  const saveEstimate = () => {
    const newEstimate = {
      customerName,
      jobNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      paints,
      total: total + gstHst, // Total with tax
    };

    // Fetch existing estimates from localStorage
    const existingEstimates = JSON.parse(localStorage.getItem('estimates')) || [];

    // Check if editing, update estimate if necessary
    if (location.state?.estimateIndex !== undefined) {
      existingEstimates[location.state.estimateIndex] = newEstimate;
    } else {
      existingEstimates.push(newEstimate); // Add new estimate
    }

    // Save estimates back to localStorage
    localStorage.setItem('estimates', JSON.stringify(existingEstimates));

    // Redirect to the estimates page
    navigate('/estimates');
  };

  // Add Room Handler
  const addRoom = () => setRooms([...rooms, { roomName: '', cost: 0 }]);

  // Add Extra Handler
  const addExtra = () => setExtras([...extras, { type: '', cost: 0 }]);

  // Add Paint Handler
  const addPaint = () => setPaints([...paints, { type: '', cost: 0 }]);

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
  const removeExtra = (index) => setExtras(extras.filter((_, i) => i !== index));
  const removePaint = (index) => setPaints(paints.filter((_, i) => i !== index));

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Paint Job Estimator</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-tealLight text-white p-2 rounded hover:bg-gray-600"
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
              <label htmlFor="date" className="block text-sm font-bold">Date:</label>
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
                <label htmlFor="jobNumber" className="block text-sm font-bold">Job Number:</label>
                <input
                  type="text"
                  id="jobNumber"
                  className="border rounded p-2 w-20"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)}
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
                <label htmlFor="customerName" className="block text-sm font-bold">Customer Name:</label>
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
                <label htmlFor="phoneNumber" className="block text-sm font-bold">Phone Number:</label>
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
                <label htmlFor="address" className="block text-sm font-bold">Address:</label>
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
            <button className="bg-darkBlue text-white p-2 rounded w-full sm:w-auto" onClick={addRoom}>Add Room</button>
            <button className="bg-tealLight text-white p-2 rounded w-full sm:w-auto" onClick={addExtra}>Add Extra</button>
            <button className="bg-pink text-white p-2 rounded w-full sm:w-auto" onClick={addPaint}>Add Paint</button>
            <button className="bg-blue text-white p-2 rounded w-full sm:w-auto" onClick={toggleEditPrices}>
              Prices
            </button>
          </div>

          {/* Edit Room Prices Section */}
          {editPrices && (
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold mb-2">Edit Room Prices</h3>
              {costOptions.map((option, index) => (
                <div key={index} className="mb-2">
                  <label className="block text-sm font-bold">{option.label}:</label>
                  <input
                    type="number"
                    value={option.value}
                    onChange={(e) => {
                      const updatedPrices = [...costOptions];
                      updatedPrices[index].value = parseFloat(e.target.value) || 0;
                      setCostOptions(updatedPrices);
                    }}
                    className="border rounded w-full p-2"
                  />
                </div>
              ))}
              <button
                className="bg-pink text-white p-2 mt-4 rounded w-full"
                onClick={toggleEditPrices}
              >
                Save Prices
              </button>
            </div>
          )}

          {/* Display added Rooms */}
          {rooms.length > 0 && (
            <>
              <h3 className="font-bold mb-2">Rooms</h3>
              {rooms.map((room, index) => (
                <div key={index} className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4">
                  {/* Room Name Dropdown */}
                  <select
                    className="border p-2 mb-2 w-full"
                    value={room.roomName}
                    onChange={(e) => updateRoom(index, 'roomName', e.target.value)}
                  >
                    <option value="">Select Room</option>
                    {roomOptions.map((roomName, i) => (
                      <option key={i} value={roomName}>{roomName}</option>
                    ))}
                  </select>

                  {/* Cost Dropdown */}
                  <select
                    className="border p-2 mb-2 w-full"
                    value={room.cost}
                    onChange={(e) => updateRoom(index, 'cost', e.target.value)}
                  >
                    <option value="">Select Cost</option>
                    {costOptions.map((option, i) => (
                      <option key={i} value={option.value}>{option.label} - ${option.value}</option>
                    ))}
                  </select>

                  {/* Remove Room Button */}
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
                <div key={index} className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4">
                  <select
                    className="border p-2 mb-2 w-full"
                    value={extra.type}
                    onChange={(e) => updateExtra(index, 'type', e.target.value)}
                  >
                    <option value="">Select Extra</option>
                    <option value="Stairs - Stain or Paint">Stairs - Stain or Paint</option>
                    <option value="Stairs Stained to Match Floor">Stairs Stained to Match Floor</option>
                    <option value="Railings">Railings</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Manually enter cost */}
                  <input
                    type="number"
                    className="border p-2 mb-2 w-full"
                    placeholder="Cost"
                    value={extra.cost}
                    onChange={(e) => updateExtra(index, 'cost', e.target.value)}
                  />

                  {/* Remove Extra Button */}
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
                <div key={index} className="section-bordered p-4 bg-white rounded-lg shadow-sm mb-4">
                  <select
                    className="border p-2 mb-2 w-full"
                    value={paint.type}
                    onChange={(e) => updatePaint(index, 'type', e.target.value)}
                  >
                    <option value="">Select Paint Type</option>
                    <option value="Primer">Primer</option>
                    <option value="Paint">Paint</option>
                    <option value="Stain">Stain</option>
                  </select>

                  {/* Manually enter cost */}
                  <input
                    type="number"
                    className="border p-2 mb-2 w-full"
                    placeholder="Cost"
                    value={paint.cost}
                    onChange={(e) => updatePaint(index, 'cost', e.target.value)}
                  />

                  {/* Remove Paint Button */}
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

          {/* Save Estimate Button */}
          <button
            className="bg-green text-white p-2 mt-4 w-full rounded"
            onClick={saveEstimate}
          >
            Save Estimate
          </button>
        </div>
      </main>
    </div>
  );
};

export default EstimateCalculator;
