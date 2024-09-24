import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const NewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize form state (pre-populate with location.state if coming from a closed job)
  const [customerName, setCustomerName] = useState(
    location.state?.job?.customerName || ""
  );
  const [jobNumber, setJobNumber] = useState(
    location.state?.job?.jobNumber || ""
  );
  const [date, setDate] = useState(location.state?.job?.date || "");
  const [address, setAddress] = useState(location.state?.job?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(
    location.state?.job?.phoneNumber || ""
  );
  const [rooms, setRooms] = useState([]);
  const [extras, setExtras] = useState([]);
  const [paints, setPaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [gstHst, setGstHst] = useState(0);

  // Room cost options
  const costOptions = [
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
  ];

  const roomOptions = [
    "Kitchen",
    "Master Bedroom",
    "Walk-in Closet",
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

  // Recalculate the total whenever rooms, extras, or paints change
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

  useEffect(() => {
    calculateTotal();
  }, [rooms, extras, paints, calculateTotal]);

  // Save the invoice to localStorage
  const saveInvoice = () => {
    const newInvoice = {
      customerName,
      jobNumber,
      date,
      address,
      phoneNumber,
      rooms,
      extras,
      paints,
      total: total + gstHst, // Total including GST/HST
    };

    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    invoices.push(newInvoice);
    localStorage.setItem("invoices", JSON.stringify(invoices));

    // Generate the PDF after saving the invoice
    generatePdf(newInvoice);

    // Navigate to the invoices page
    navigate("/invoices");
  };

  // Generate PDF
  const generatePdf = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Invoice", 10, 10);
    doc.setFontSize(12);
    doc.text(`Job Number: ${invoice.jobNumber}`, 10, 30);
    doc.text(`Customer Name: ${invoice.customerName}`, 10, 40);
    doc.text(`Address: ${invoice.address}`, 10, 50);
    doc.text(`Date: ${invoice.date}`, 10, 60);
    doc.text(`Subtotal: $${invoice.total.toFixed(2)}`, 10, 80);
    doc.text(`GST/HST: $${gstHst.toFixed(2)}`, 10, 90);
    doc.text(`Total: $${(invoice.total + gstHst).toFixed(2)}`, 10, 100);
    doc.save(`Invoice_${invoice.jobNumber}.pdf`);
  };

  // Add Room Handler
  const addRoom = () => setRooms([...rooms, { roomName: "", cost: 0 }]);

  // Add Extra Handler
  const addExtra = () => setExtras([...extras, { type: "", cost: 0 }]);

  // Add Paint Handler
  const addPaint = () => setPaints([...paints, { type: "", cost: 0 }]);

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

  // Remove Handlers
  const removeRoom = (index) => setRooms(rooms.filter((_, i) => i !== index));
  const removeExtra = (index) =>
    setExtras(extras.filter((_, i) => i !== index));
  const removePaint = (index) =>
    setPaints(paints.filter((_, i) => i !== index));

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-green text-white p-2 rounded hover:bg-green-600"
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
                <label htmlFor="phoneNumber" className="block text-sm font-bold">
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
          </div>

          {/* Display added Rooms */}
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
                    onChange={(e) =>
                      updateRoom(index, "roomName", e.target.value)
                    }
                  >
                    <option value="">Select Room</option>
                    {roomOptions.map((roomName, i) => (
                      <option key={i} value={roomName}>
                        {roomName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border p-2 mb-2 w-full"
                    value={room.cost}
                    onChange={(e) => updateRoom(index, "cost", e.target.value)}
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
                    onChange={(e) =>
                      updateExtra(index, "type", e.target.value)
                    }
                  >
                    <option value="">Select Extra</option>
                    <option value="Stairs - Stain or Paint">
                      Stairs - Stain or Paint
                    </option>
                    <option value="Stairs Stained to Match Floor">
                      Stairs Stained to Match Floor
                    </option>
                    <option value="Railings">Railings</option>
                    <option value="Other">Other</option>
                  </select>

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
                    onChange={(e) =>
                      updatePaint(index, "type", e.target.value)
                    }
                  >
                    <option value="">Select Paint Type</option>
                    <option value="Primer">Primer</option>
                    <option value="Paint">Paint</option>
                    <option value="Stain">Stain</option>
                  </select>

                  <input
                    type="number"
                    className="border p-2 mb-2 w-full"
                    placeholder="Cost"
                    value={paint.cost}
                    onChange={(e) => updatePaint(index, "cost", e.target.value)}
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

          {/* Subtotal, GST/HST, and Total */}
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

          {/* Save Invoice Button */}
          <button
            className="bg-green text-white p-2 mt-4 w-full rounded"
            onClick={saveInvoice}
          >
            Save Invoice
          </button>
        </div>
      </main>
    </div>
  );
};

export default NewInvoice;
