import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const ManageTeams = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    position: "",
    image: null,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("/api/teams"); // Adjust the endpoint as necessary
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleAddTeamMember = async () => {
    const formData = new FormData();
    formData.append("name", newTeamMember.name);
    formData.append("position", newTeamMember.position);
    formData.append("image", newTeamMember.image);

    try {
      const response = await axios.post("/api/teams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTeams([...teams, response.data]);
      setNewTeamMember({ name: "", position: "", image: null });
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleDeleteTeamMember = async (id) => {
    try {
      await axios.delete(`/api/teams/${id}`); // Adjust the endpoint as necessary
      setTeams(teams.filter((team) => team._id !== id));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  return (
    <div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Teams</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New Team Member</h2>
          <input
            type="text"
            placeholder="Name"
            value={newTeamMember.name}
            onChange={(e) =>
              setNewTeamMember({ ...newTeamMember, name: e.target.value })
            }
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Position"
            value={newTeamMember.position}
            onChange={(e) =>
              setNewTeamMember({ ...newTeamMember, position: e.target.value })
            }
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            type="file"
            onChange={(e) =>
              setNewTeamMember({ ...newTeamMember, image: e.target.files[0] })
            }
            className="block w-full mb-2 p-2 border rounded"
          />
          <button
            onClick={handleAddTeamMember}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Team Member
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-2">Existing Team Members</h2>
        <ul className="space-y-4">
          {Array.isArray(teams) &&
            teams.map((team) => (
              <li key={team._id} className="p-4 border rounded shadow">
                <h3 className="text-lg font-bold">{team.name}</h3>
                <p>{team.position}</p>
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-24 h-24 rounded-full"
                />
                <button
                  onClick={() => handleDeleteTeamMember(team._id)}
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

export default ManageTeams;
