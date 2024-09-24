import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PastJobs = () => {
  const [closedJobs, setClosedJobs] = useState([]);
  const navigate = useNavigate();

  // Load closed jobs from localStorage on component mount
  useEffect(() => {
    const savedClosedJobs = JSON.parse(localStorage.getItem('closedJobs')) || [];
    setClosedJobs(savedClosedJobs);
  }, []);

  // Function to delete a job
  const handleDelete = (jobIndex) => {
    const updatedJobs = closedJobs.filter((_, index) => index !== jobIndex);
    setClosedJobs(updatedJobs);
    localStorage.setItem('closedJobs', JSON.stringify(updatedJobs)); // Update localStorage
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Home Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Closed Jobs</h1>
        <button
          className="bg-green text-white p-2 rounded hover:bg-green-600"
          onClick={() => navigate('/')} // Navigate back to the dashboard
        >
          Home
        </button>
      </header>

      {/* Display Closed Jobs */}
      {closedJobs.length > 0 ? (
        closedJobs.map((job, jobIndex) => (
          <div key={jobIndex} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Job #{job.jobNumber}</span>
              <span>{job.customerName}</span>
              <span>{job.date}</span>
            </div>

            {/* Job Details */}
            <div className="mb-4">
              <p>Address: {job.address}</p>
              <p>Phone: {job.phoneNumber}</p>
              <p>Total: ${job.total.toFixed(2)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-darkBlue text-white p-2 rounded"
                onClick={() => {
                  navigate('/new-invoice', { state: { job, jobIndex } });
                }}
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
