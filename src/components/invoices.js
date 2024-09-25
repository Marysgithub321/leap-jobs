import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  // Load saved invoices from localStorage
  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    setInvoices(savedInvoices);
  }, []);

  // Function to delete an invoice
  const deleteInvoice = (index) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </header>

      {invoices.length > 0 ? (
        invoices.map((invoice, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            {/* Display the date and job number on one line */}
            <p>{`Date: ${invoice.date || 'N/A'} | Job Number: ${invoice.jobNumber || 'N/A'}`}</p>

            {/* Display customer details */}
            <p>{`Customer Name: ${invoice.customerName || 'N/A'}`}</p>
            <p>{`Phone Number: ${invoice.phoneNumber || 'N/A'}`}</p>
            <p>{`Address: ${invoice.address || 'N/A'}`}</p>

            {/* Display the rooms */}
            {invoice.rooms && invoice.rooms.length > 0 && (
              <div>
                <h4>Rooms:</h4>
                <ul>
                  {invoice.rooms.map((room, i) => (
                    <li key={i}>
                      {`${room.roomName || 'N/A'}: $${parseFloat(room.cost || 0).toFixed(2)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display the extras */}
            {invoice.extras && invoice.extras.length > 0 && (
              <div>
                <h4>Extras:</h4>
                <ul>
                  {invoice.extras.map((extra, i) => (
                    <li key={i}>
                      {`${extra.type || 'N/A'}: $${parseFloat(extra.cost || 0).toFixed(2)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display the paints */}
            {invoice.paints && invoice.paints.length > 0 && (
              <div>
                <h4>Paints:</h4>
                <ul>
                  {invoice.paints.map((paint, i) => (
                    <li key={i}>
                      {`${paint.type || 'N/A'}: $${parseFloat(paint.cost || 0).toFixed(2)}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Display the subtotal, GST/HST, and total */}
            <p>{`Subtotal: $${parseFloat(invoice.subtotal || 0).toFixed(2)}`}</p>
            <p>{`GST/HST: $${parseFloat(invoice.gstHst || 0).toFixed(2)}`}</p>
            <p>{`Total: $${parseFloat(invoice.total || 0).toFixed(2)}`}</p>

            {/* Button actions: Download PDF and Delete Invoice */}
            <div className="flex space-x-4">
              <button
                className="bg-darkBlue text-white p-2 mt-4 rounded"
                onClick={() => {
                  const doc = new jsPDF();
                  doc.text('Invoice', 10, 10);
                  doc.text(`Date: ${invoice.date || 'N/A'} | Job Number: ${invoice.jobNumber || 'N/A'}`, 10, 30);
                  doc.text(`Customer Name: ${invoice.customerName || 'N/A'}`, 10, 40);
                  doc.text(`Phone Number: ${invoice.phoneNumber || 'N/A'}`, 10, 50);
                  doc.text(`Address: ${invoice.address || 'N/A'}`, 10, 60);

                  // Add rooms to the PDF
                  let lineHeight = 70;
                  if (invoice.rooms && invoice.rooms.length > 0) {
                    doc.text('Rooms:', 10, lineHeight);
                    lineHeight += 10;
                    invoice.rooms.forEach((room) => {
                      doc.text(`${room.roomName || 'N/A'}: $${parseFloat(room.cost || 0).toFixed(2)}`, 10, lineHeight);
                      lineHeight += 10;
                    });
                  }

                  // Add extras to the PDF
                  if (invoice.extras && invoice.extras.length > 0) {
                    doc.text('Extras:', 10, lineHeight);
                    lineHeight += 10;
                    invoice.extras.forEach((extra) => {
                      doc.text(`${extra.type || 'N/A'}: $${parseFloat(extra.cost || 0).toFixed(2)}`, 10, lineHeight);
                      lineHeight += 10;
                    });
                  }

                  // Add paints to the PDF
                  if (invoice.paints && invoice.paints.length > 0) {
                    doc.text('Paints:', 10, lineHeight);
                    lineHeight += 10;
                    invoice.paints.forEach((paint) => {
                      doc.text(`${paint.type || 'N/A'}: $${parseFloat(paint.cost || 0).toFixed(2)}`, 10, lineHeight);
                      lineHeight += 10;
                    });
                  }

                  // Add totals to the PDF
                  doc.text(`Subtotal: $${parseFloat(invoice.subtotal || 0).toFixed(2)}`, 10, lineHeight + 10);
                  doc.text(`GST/HST: $${parseFloat(invoice.gstHst || 0).toFixed(2)}`, 10, lineHeight + 20);
                  doc.text(`Total: $${parseFloat(invoice.total || 0).toFixed(2)}`, 10, lineHeight + 30);

                  doc.save(`Invoice_${invoice.jobNumber || 'N/A'}.pdf`);
                }}
              >
                Download PDF
              </button>

              {/* Delete Invoice Button */}
              <button
                className="bg-pink text-white p-2 mt-4 rounded"
                onClick={() => deleteInvoice(index)}
              >
                Delete Job
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
