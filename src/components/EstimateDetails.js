import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EstimateDetails = () => {
  const { jobNumber } = useParams(); // Extract the job number from the URL
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    const savedEstimates = JSON.parse(localStorage.getItem('estimates')) || [];
    
    // Find the estimate by matching the job number
    const selectedEstimate = savedEstimates.find(est => est.jobNumber === jobNumber);
    setEstimate(selectedEstimate);
  }, [jobNumber]);

  if (!estimate) return <p>Loading...</p>;

  return (
    <div>
      <h1>Estimate #{estimate.jobNumber}</h1>
      <p>Customer Name: {estimate.customerName}</p>
      <p>Date: {estimate.date}</p>
      {/* Other details */}
    </div>
  );
};

export default EstimateDetails;
