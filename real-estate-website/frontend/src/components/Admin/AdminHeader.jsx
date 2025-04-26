import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="hidden md:flex space-x-4">
          <Link to="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/manage-lands" className="hover:underline">
            Manage Lands
          </Link>
          <Link to="/admin/manage-users" className="hover:underline">
            Manage Users
          </Link>
          {/* <Link to="/admin/manage-payments" className="hover:underline">
            Manage Payments
          </Link> */}

          <Link to="/admin/manage-announcements" className="hover:underline">
            Manage Announcements
          </Link>
          <Link to="/admin/manage-teams" className="hover:underline">
            Manage Teams
          </Link>
        </nav>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50">
          <div className="absolute top-0 right-0 w-72 bg-white h-full shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <nav className="mt-16 space-y-4 px-6">
              <Link
                to="/admin/dashboard"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/manage-lands"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Manage Lands
              </Link>
              <Link
                to="/admin/manage-users"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Manage Users
              </Link>
              {/* <Link
                to="/admin/manage-payments"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Manage Payments
              </Link> */}

              <Link
                to="/admin/manage-announcements"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Manage Announcements
              </Link>
              <Link to="/admin/manage-teams" className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
              onClick={toggleMenu}>
                Manage Teams
              </Link>
              <Link to="/admin/manage-inspections" className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
              onClick={toggleMenu}>
                Manage Inspections
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
