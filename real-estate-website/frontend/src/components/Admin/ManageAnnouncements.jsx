import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    status: "",
    festiveSeasons: "",
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("/api/announcements"); // Adjust the endpoint as necessary
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    try {
      const response = await axios.post("/api/announcements", newAnnouncement); // Adjust the endpoint as necessary
      setAnnouncements([...announcements, response.data]);
      setNewAnnouncement({
        title: "",
        description: "",
        status: "",
        festiveSeasons: "",
      });
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`); // Adjust the endpoint as necessary
      setAnnouncements(
        announcements.filter((announcement) => announcement._id !== id)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Announcements</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New Announcement</h2>
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
            className="block w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newAnnouncement.description}
            onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                description: e.target.value,
              })
            }
            className="block w-full mb-2 p-2 border rounded"
          ></textarea>
          <select
            value={newAnnouncement.status}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, status: e.target.value })
            }
            className="block w-full mb-2 p-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="Promo">Promo</option>
            <option value="Price Increase">Price Increase</option>
            <option value="Almost Sold Out">Almost Sold Out</option>
            <option value="Warning">Warning</option>
          </select>
          <input
            type="text"
            placeholder="Festive Seasons (comma-separated)"
            value={newAnnouncement.festiveSeasons}
            onChange={(e) =>
              setNewAnnouncement({
                ...newAnnouncement,
                festiveSeasons: e.target.value,
              })
            }
            className="block w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleAddAnnouncement}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Announcement
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2">Existing Announcements</h2>
        <ul className="space-y-4">
          {Array.isArray(announcements) &&
            announcements.map((announcement) => (
              <li key={announcement._id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold">{announcement.title}</h3>
                <p>{announcement.description}</p>
                <p>Status: {announcement.status}</p>
                <p>Festive Seasons: {announcement.festiveSeasons}</p>
                <button
                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
