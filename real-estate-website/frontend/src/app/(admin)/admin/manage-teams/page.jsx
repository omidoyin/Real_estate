"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ManageTeams() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    status: "Active",
    bio: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.position.trim()) {
      errors.position = "Position is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: "",
      position: "",
      email: "",
      phone: "",
      status: "Active",
      bio: "",
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      phone: member.phone,
      status: member.status,
      bio: member.bio || "",
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (member) => {
    setCurrentMember(member);
    setIsViewModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  // Handle add team member
  const handleAddMember = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just add to the state
    const newMember = {
      id: team.length + 1,
      name: formData.name,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      bio: formData.bio,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setTeam([...team, newMember]);
    closeModals();

    // Show success message (in a real app)
    alert("Team member added successfully!");
  };

  // Handle edit team member
  const handleEditMember = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    // For demo purposes, just update the state
    const updatedTeam = team.map((member) => {
      if (member.id === currentMember.id) {
        return {
          ...member,
          name: formData.name,
          position: formData.position,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          bio: formData.bio,
        };
      }
      return member;
    });

    setTeam(updatedTeam);
    closeModals();

    // Show success message (in a real app)
    alert("Team member updated successfully!");
  };

  // Handle remove team member
  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      // In a real app, this would be an API call
      // For demo purposes, just update the state
      const updatedTeam = team.filter((member) => member.id !== memberId);
      setTeam(updatedTeam);

      // Show success message (in a real app)
      alert("Team member removed successfully!");
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = Cookies.get("adminToken");
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    // Fetch team data
    const fetchTeam = async () => {
      try {
        setLoading(true);

        // In a real app, this would fetch from your API
        // const response = await fetch('/api/admin/team', {
        //   headers: {
        //     'Authorization': `Bearer ${adminToken}`
        //   }
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Failed to fetch team');
        // }
        //
        // const data = await response.json();

        // For demo purposes, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockTeam = [
          {
            id: 1,
            name: "John Smith",
            position: "CEO",
            email: "john@example.com",
            phone: "(555) 123-4567",
            joinDate: "2020-01-15",
            status: "Active",
          },
          {
            id: 2,
            name: "Sarah Johnson",
            position: "Sales Manager",
            email: "sarah@example.com",
            phone: "(555) 234-5678",
            joinDate: "2020-03-20",
            status: "Active",
          },
          {
            id: 3,
            name: "Michael Brown",
            position: "Property Consultant",
            email: "michael@example.com",
            phone: "(555) 345-6789",
            joinDate: "2021-02-10",
            status: "Active",
          },
          {
            id: 4,
            name: "Emily Davis",
            position: "Marketing Specialist",
            email: "emily@example.com",
            phone: "(555) 456-7890",
            joinDate: "2021-05-05",
            status: "On Leave",
          },
          {
            id: 5,
            name: "David Wilson",
            position: "Financial Advisor",
            email: "david@example.com",
            phone: "(555) 567-8901",
            joinDate: "2022-01-10",
            status: "Active",
          },
        ];

        setTeam(mockTeam);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Team</h1>
        <button
          className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
          onClick={openAddModal}
        >
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {team.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center text-xl font-bold text-gray-600 cursor-pointer"
                  onClick={() => openViewModal(member)}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold cursor-pointer hover:text-primary-blue"
                    onClick={() => openViewModal(member)}
                  >
                    {member.name}
                  </h3>
                  <p className="text-primary-blue">{member.position}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {member.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {member.phone}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {new Date(member.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    member.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {member.status}
                </span>

                <div>
                  <button
                    className="text-primary-blue hover:text-accent-green mr-2"
                    onClick={() => openEditModal(member)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Team Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Team Member</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.position ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.position && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.position}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="bio"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {isEditModalOpen && currentMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Team Member</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditMember}>
              <div className="mb-4">
                <label
                  htmlFor="edit-name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-position"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Position
                </label>
                <input
                  type="text"
                  id="edit-position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.position ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.position && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.position}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-status"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="edit-bio"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                  onClick={closeModals}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Team Member Modal */}
      {isViewModalOpen && currentMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Team Member Profile</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModals}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-gray-600">
                    {currentMember.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {currentMember.name}
                  </h3>
                  <p className="text-primary-blue font-medium">
                    {currentMember.position}
                  </p>
                  <span
                    className={`mt-2 px-3 py-1 text-sm rounded-full ${
                      currentMember.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {currentMember.status}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="text-lg font-medium mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-800">
                        {currentMember.email}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-800">
                        {currentMember.phone}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-800">
                        Joined{" "}
                        {new Date(currentMember.joinDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                {currentMember.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-lg font-medium mb-2">Bio</h4>
                    <p className="text-gray-700">{currentMember.bio}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    className="bg-primary-blue text-white px-4 py-2 rounded-md hover:bg-accent-green"
                    onClick={() => {
                      closeModals();
                      openEditModal(currentMember);
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => {
                      closeModals();
                      handleRemoveMember(currentMember.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
