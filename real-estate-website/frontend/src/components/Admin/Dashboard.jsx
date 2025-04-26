import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminHeader";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLands: 0,
    totalPayments: 0,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats"); // Adjust the endpoint as necessary
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative">
     

      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl">Total Users</h2>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl">Total Lands</h2>
            <p className="text-2xl font-bold">{stats.totalLands}</p>
          </div>
          {/* <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl">Total Payments</h2>
            <p className="text-2xl font-bold">{stats.totalPayments}</p>
          </div> */}
        </div>

       
      </div>
    </div>
  );
};

export default AdminDashboard;
