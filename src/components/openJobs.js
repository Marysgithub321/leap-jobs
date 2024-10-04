import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OpenJobs = () => {
  const navigate = useNavigate();
  const [openJobs, setOpenJobs] = useState([]);

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
  const deleteJob = (jobIndex) => {
    const updatedJobs = openJobs.filter((_, i) => i !== jobIndex);
    saveJobs(updatedJobs);
  };

  // Function to move a job to closed jobs
  const closeJob = (jobIndex) => {
    const closedJobs = JSON.parse(localStorage.getItem("closedJobs")) || [];
    closedJobs.push(openJobs[jobIndex]);
    localStorage.setItem("closedJobs", JSON.stringify(closedJobs));
    deleteJob(jobIndex); // Call deleteJob to remove from open jobs after moving
  };

  // Function to update room progress (tracking selections)
  const updateRoomProgress = (jobIndex, roomIndex, progressOption) => {
    const updatedJobs = [...openJobs];
    const room = updatedJobs[jobIndex].rooms[roomIndex];

    // Ensure room.progress is initialized as an array
    room.progress = room.progress || [];

    // Toggle the selected progress option
    if (room.progress.includes(progressOption)) {
      room.progress = room.progress.filter((item) => item !== progressOption);
    } else {
      room.progress.push(progressOption);
    }

    saveJobs(updatedJobs);
  };

  // Function to update room notes
  const updateRoomNote = (jobIndex, roomIndex, value) => {
    const updatedJobs = [...openJobs];
    updatedJobs[jobIndex].rooms[roomIndex].note = value;
    saveJobs(updatedJobs);
  };

  // Predefined progress options
  const progressOptions = [
    "1 coat primer on walls",
    "1 coat primer on ceiling",
    "1 coat of paint on ceiling",
    "2 coats of paint on ceiling",
    "1 coat cut in",
    "2 coats cut in",
    "1 coat paint on walls",
    "2 coats paint on walls",
    "3 coats paint on walls",
    "1 coat paint on trim",
    "2 coats paint on trim",
    "1 coat paint on doors",
    "2 coats paint on doors",
    "1 sanding",
    "2 sanding",
    "3 sanding",
    "1 coat of stain",
    "2 coats of stain",
    "1 clear coat",
    "2 clear coats",
    "3 clear coats",
  ];

  // State to track the visibility of the dropdowns
  const [showProgressDropdown, setShowProgressDropdown] = useState(
    openJobs.map(() => false)
  );

  // Toggle dropdown visibility
  const toggleProgressDropdown = (jobIndex, roomIndex) => {
    const updatedVisibility = [...showProgressDropdown];
    updatedVisibility[jobIndex] = !updatedVisibility[jobIndex];
    setShowProgressDropdown(updatedVisibility);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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

            {/* Room Notes and Progress */}
            <div className="mb-4">
              <h3 className="font-semibold">Room Notes and Progress</h3>
              {job.rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="mb-4">
                  <h4 className="font-bold mb-2">{room.roomName}</h4>

                  {/* Dropdown Button for Progress */}
                  <button
                    className="bg-darkBlue text-white p-2 rounded mb-2"
                    onClick={() => toggleProgressDropdown(jobIndex, roomIndex)}
                  >
                    {showProgressDropdown[jobIndex]
                      ? "Hide Progress"
                      : "Show Progress"}
                  </button>

                  {/* Progress Checklist (Visible if dropdown is open) */}
                  {showProgressDropdown[jobIndex] && (
                    <div className="mb-2">
                      {progressOptions.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-1"
                        >
                          <input
                            type="checkbox"
                            id={`progress-${jobIndex}-${roomIndex}-${optionIndex}`}
                            checked={room.progress?.includes(option)}
                            onChange={() =>
                              updateRoomProgress(jobIndex, roomIndex, option)
                            }
                          />
                          <label
                            htmlFor={`progress-${jobIndex}-${roomIndex}-${optionIndex}`}
                            className="ml-2"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Room Note */}
                  <textarea
                    className="border p-2 w-full"
                    placeholder="Add note for this room"
                    value={room.note || ""}
                    onChange={(e) =>
                      updateRoomNote(jobIndex, roomIndex, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

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
          </div>
        ))
      ) : (
        <p>No open jobs found</p>
      )}
    </div>
  );
};

export default OpenJobs;
