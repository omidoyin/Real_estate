import React, { useState, useEffect } from "react";

const ManageInspections = () => {
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    // Fetch inspections data from the API
    fetch("/api/inspections")
      .then((response) => response.json())
      .then((data) => setInspections(data));
  }, []);

  const markDone = (landId) => {
    // Update the inspections for the land as done
    fetch(`/api/inspections/mark-done/${landId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((updatedInspections) => setInspections(updatedInspections));
  };

  const groupedInspections = inspections.reduce((acc, inspection) => {
    if (!acc[inspection.landName]) {
      acc[inspection.landName] = [];
    }
    acc[inspection.landName].push(inspection);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Inspections</h1>
      {Object.keys(groupedInspections).map((landName) => (
        <div key={landName} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{landName}</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => markDone(groupedInspections[landName][0].landId)}
          >
            Mark All Done
          </button>
          <ul className="list-disc pl-6">
            {groupedInspections[landName].map((inspection) => (
              <li key={inspection.id} className="mb-1">
                {inspection.date} - {inspection.status}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ManageInspections;
