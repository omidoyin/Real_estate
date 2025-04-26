import React from "react";

const LandCard = ({ land }) => {
  return (
    <div className="card bg-white shadow-md rounded-lg p-4">
      <img
        src={land.image}
        alt={land.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <h2 className="text-xl font-semibold mt-2">{land.title}</h2>
      <p className="text-gray-600">Location: {land.location}</p>
      <p className="text-lg font-bold">${land.price}</p>
    </div>
  );
};

export default LandCard;
