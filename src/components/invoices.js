import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {}; // Access passed job data

  // Load saved invoices from localStorage
  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(savedInvoices);
  }, []);

  // Function to delete an invoice
  const deleteInvoice = (index) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
  };

  // Save the passed job data as a new invoice
  const saveInvoice = () => {
    if (job) {
      const updatedInvoices = [...invoices, job];
      setInvoices(updatedInvoices);
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      {/* Display the job details passed from PastJobs */}
      {job && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
          <p>{`Date: ${job.date || "N/A"} | Job Number: ${
            job.estimateNumber || "N/A"
          }`}</p>
          <p>{`Customer Name: ${job.customerName || "N/A"}`}</p>
          <p>{`Phone Number: ${job.phoneNumber || "N/A"}`}</p>
          <p>{`Address: ${job.address || "N/A"}`}</p>

          {/* Display Room details */}
          {job.rooms && job.rooms.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Rooms</h3>
              <ul>
                {job.rooms.map((room, i) => (
                  <li key={i}>
                    {`${room.roomName}: $${parseFloat(room.cost || 0).toFixed(
                      2
                    )}  ${room.note || "No notes"}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Extra details */}
          {job.extras && job.extras.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Extras</h3>
              <ul>
                {job.extras.map((extra, i) => (
                  <li key={i}>
                    {`${extra.type}: $${parseFloat(extra.cost || 0).toFixed(
                      2
                    )} - Notes: ${extra.note || "No notes"}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Description details */}
          {job.description && (
            <div className="mb-4">
              <h3 className="font-semibold">Description</h3>
              <ul>
                <li>
                  {/* Display description and custom description if applicable */}
                  {job.description === "Other" && job.customDescription
                    ? `${job.customDescription} - Notes: ${
                        job.notes || "No notes"
                      }`
                    : `${job.description}: Notes: ${job.notes || "No notes"}`}
                </li>
              </ul>
            </div>
          )}

          {/* Totals */}
          <div className="section-bordered border-t mt-4 pt-4">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${parseFloat(job.subtotal || 0).toFixed(2)}</p>
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

          <button
            className="bg-darkBlue text-white p-2 mt-4 rounded"
            onClick={saveInvoice}
          >
            Save Invoice
          </button>
        </div>
      )}

      {/* Display saved invoices */}
      {invoices.length > 0 ? (
        invoices.map((invoice, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <p>{`Date: ${invoice.date || "N/A"} | Invoice Number: ${
              invoice.estimateNumber || "N/A"
            }`}</p>
            <p>{`Customer Name: ${invoice.customerName || "N/A"}`}</p>
            <p>{`Phone Number: ${invoice.phoneNumber || "N/A"}`}</p>
            <p>{`Address: ${invoice.address || "N/A"}`}</p>

            {/* Display Room details */}
            {invoice.rooms && invoice.rooms.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Rooms</h3>
                <ul>
                  {invoice.rooms.map((room, i) => (
                    <li key={i}>
                      {`${room.roomName}: $${parseFloat(room.cost || 0).toFixed(
                        2
                      )} - Notes: ${room.note || "No notes"}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display Extra details */}
            {invoice.extras && invoice.extras.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold">Extras</h3>
                <ul>
                  {invoice.extras.map((extra, i) => (
                    <li key={i}>
                      {`${extra.type}: $${parseFloat(extra.cost || 0).toFixed(
                        2
                      )} - Notes: ${extra.note || "No notes"}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display Description details */}
            {invoice.description && (
              <div className="mb-4">
                <h3 className="font-semibold">Description</h3>
                <ul>
                  <li>
                    {/* Display description and custom description if applicable */}
                    {invoice.description === "Other" && invoice.customDescription
                      ? `${invoice.customDescription} - Notes: ${
                          invoice.notes || "No notes"
                        }`
                      : `${invoice.description}: Notes: ${
                          invoice.notes || "No notes"
                        }`}
                  </li>
                </ul>
              </div>
            )}

            {/* Totals */}
            <div className="section-bordered border-t mt-4 pt-4">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${parseFloat(invoice.subtotal || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>GST/HST (13%):</p>
                <p>${(invoice.subtotal * 0.13).toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>${(invoice.subtotal * 1.13).toFixed(2)}</p>
              </div>
            </div>

            {/* Button actions: Download PDF, Edit Invoice, and Delete Invoice */}
            <div className="flex space-x-4">
              <button
                className="bg-darkBlue text-white p-2 mt-4 rounded"
                onClick={() => {
                  const doc = new jsPDF();
                  doc.text("Invoice", 10, 10);
                  doc.text(
                    `Date: ${invoice.date || "N/A"} | Invoice Number: ${
                      invoice.estimateNumber || "N/A"
                    }`,
                    10,
                    30
                  );
                  doc.text(
                    `Customer Name: ${invoice.customerName || "N/A"}`,
                    10,
                    40
                  );
                  doc.text(
                    `Phone Number: ${invoice.phoneNumber || "N/A"}`,
                    10,
                    50
                  );
                  doc.text(`Address: ${invoice.address || "N/A"}`, 10, 60);

                  // Add rooms to the PDF
                  let lineHeight = 70;
                  if (invoice.rooms && invoice.rooms.length > 0) {
                    doc.text("Rooms:", 10, lineHeight);
                    lineHeight += 10;
                    invoice.rooms.forEach((room) => {
                      doc.text(
                        `${room.roomName || "N/A"}: $${parseFloat(
                          room.cost || 0
                        ).toFixed(2)}`,
                        10,
                        lineHeight
                      );
                      lineHeight += 10;
                    });
                  }

                  // Add extras to the PDF
                  if (invoice.extras && invoice.extras.length > 0) {
                    doc.text("Extras:", 10, lineHeight);
                    lineHeight += 10;
                    invoice.extras.forEach((extra) => {
                      doc.text(
                        `${extra.type || "N/A"}: $${parseFloat(
                          extra.cost || 0
                        ).toFixed(2)}`,
                        10,
                        lineHeight
                      );
                      lineHeight += 10;
                    });
                  }

                  // Add description to the PDF
                  if (invoice.description) {
                    doc.text("Description:", 10, lineHeight);
                    lineHeight += 10;
                    doc.text(
                      `${
                        invoice.description === "Other" &&
                        invoice.customDescription
                          ? invoice.customDescription
                          : invoice.description
                      }: Notes: ${invoice.notes || "No notes"}`,
                      10,
                      lineHeight
                    );
                    lineHeight += 10;
                  }

                  // Add totals to the PDF
                  doc.text(
                    `Subtotal: $${parseFloat(
                      invoice.subtotal || 0
                    ).toFixed(2)}`,
                    10,
                    lineHeight + 10
                  );
                  doc.text(
                    `GST/HST: $${parseFloat(
                      invoice.subtotal * 0.13 || 0
                    ).toFixed(2)}`,
                    10,
                    lineHeight + 20
                  );
                  doc.text(
                    `Total: $${parseFloat(
                      invoice.subtotal * 1.13 || 0
                    ).toFixed(2)}`,
                    10,
                    lineHeight + 30
                  );

                  doc.save(`Invoice_${invoice.customerName || "N/A"}.pdf`);
                }}
              >
                Download PDF
              </button>

              <button
                className="bg-blue text-white p-2 mt-4 rounded"
                onClick={() => navigate("/new-invoice", { state: { job: invoice } })}
              >
                Edit Invoice
              </button>

              <button
                className="bg-pink text-white p-2 mt-4 rounded"
                onClick={() => deleteInvoice(index)}
              >
                Delete Invoice
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
};

export default Invoices;
