import React, { useEffect, useState } from "react";
import {
  getAvailableLands,
  addLand,
  editLand,
  deleteLand,
} from "../../utils/api";
import AdminHeader from "./AdminHeader";

const ManageLands = () => {
  const [lands, setLands] = useState([]);
  const [newLand, setNewLand] = useState({
    title: "",
    location: "",
    price: "",
    images: [],
    video: "",
  });
  const [editingLand, setEditingLand] = useState(null);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    const data = await getAvailableLands();
    setLands(data);
  };

  const handleAddLand = async () => {
    await addLand(newLand);
    fetchLands();
    setNewLand({ title: "", location: "", price: "", images: [], video: "" });
  };

  const handleEditLand = async () => {
    await editLand(editingLand._id, newLand);
    fetchLands();
    setEditingLand(null);
    setNewLand({ title: "", location: "", price: "", images: [], video: "" });
  };

  const handleDeleteLand = async (id) => {
    await deleteLand(id);
    fetchLands();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Lands</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {editingLand ? "Edit Land" : "Add New Land"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={newLand.title}
          onChange={(e) => setNewLand({ ...newLand, title: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newLand.location}
          onChange={(e) => setNewLand({ ...newLand, location: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newLand.price}
          onChange={(e) => setNewLand({ ...newLand, price: e.target.value })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setNewLand({ ...newLand, images: Array.from(e.target.files) })
          }
          className="block w-full mb-2 p-2 border rounded"
        />
        <textarea
          placeholder="Detailed Description"
          value={newLand.description || ""}
          onChange={(e) =>
            setNewLand({ ...newLand, description: e.target.value })
          }
          className="block w-full mb-2 p-2 border rounded"
        ></textarea>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setNewLand({ ...newLand, video: e.target.files[0] })}
          className="block w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={editingLand ? handleEditLand : handleAddLand}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {editingLand ? "Update Land" : "Add Land"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Existing Lands</h2>
      <ul className="space-y-4">
        {lands.map((land) => (
          <li key={land._id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-bold">{land.title}</h3>
            <p>Location: {land.location}</p>
            <p>Price: ${land.price}</p>
            <button
              onClick={() => {
                setEditingLand(land);
                setNewLand(land);
              }}
              className="text-blue-500 hover:text-blue-700 mt-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteLand(land._id)}
              className="text-red-500 hover:text-red-700 mt-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageLands;
