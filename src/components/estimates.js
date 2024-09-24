import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Estimates = () => {
  const [estimates, setEstimates] = useState([]);
  const navigate = useNavigate(); // Use hook to navigate between routes

  // Fetch estimates from localStorage when the component loads
  useEffect(() => {
    const savedEstimates = JSON.parse(localStorage.getItem("estimates")) || [];
    setEstimates(savedEstimates);
  }, []);

  // Function to navigate to the EstimateDetails page
  const openEstimate = (jobNumber) => {
    navigate(`/estimate-details/${jobNumber}`); // Pass job number instead of index
  };
  

  // Function to edit the estimate
  const editEstimate = (index) => {
    navigate("/estimate-calculator", {
      state: { estimate: estimates[index], estimateIndex: index },
    });
  };

  // Function to delete the estimate
  const deleteEstimate = (index) => {
    const updatedEstimates = estimates.filter((_, i) => i !== index);
    setEstimates(updatedEstimates);
    localStorage.setItem("estimates", JSON.stringify(updatedEstimates));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Estimate and Home button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estimates</h1>
        <button
          className="bg-green text-white p-2 rounded"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </header>

      {/* Estimates Table */}
      {estimates.length > 0 ? (
        estimates.map((estimate, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
            {/* Labels */}
            <div className="flex justify-between mb-2 font-semibold text-gray-700">
              <span>Name</span>
              <span>Job</span>
              <span>Total</span>
            </div>

            {/* Estimate Data */}
            <div className="flex justify-between mb-4">
              <span>{estimate.customerName}</span>
              <span>{estimate.jobNumber}</span>
              <span>${estimate.total.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                className="bg-blue text-white p-2 rounded"
                onClick={() => openEstimate(estimate.jobNumber)} // Pass job number as the ID
              >
                Open
              </button>

              <button
                className="bg-tealLight text-white p-2 rounded"
                onClick={() => editEstimate(index)}
              >
                Edit
              </button>
              <button
                className="bg-pink text-white p-2 rounded"
                onClick={() => deleteEstimate(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No estimates found</p>
      )}
    </div>
  );
};

export default Estimates;
