import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide">Real Estate</h1>
        <nav className="hidden md:flex space-x-6 ">
          <Link to="/" className="hover:underline text-lg font-semibold text-white">
            Home
          </Link>
          {/* <Link to="/about" className="hover:underline text-lg font-semibold">
            About
          </Link> */}
          <Link
            to="/auth/login"
            className="hover:underline text-lg font-semibold text-white"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="hover:underline text-lg font-semibold text-white"
          >
            Sign Up
          </Link>
          <Link to="/why-us" className="hover:underline text-white">
            Why Us
          </Link>
          <Link
                to="/blog"
                className="hover:underline text-white"
              >
                Blog
              </Link>
          <Link to="/contact" className="hover:underline text-white">
            Contact Us
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
          <div className="absolute top-0 right-0 w-64 bg-white h-full shadow-lg">
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
                to="/"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/auth/login"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
              <Link
                to="/why-us"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Why Us
              </Link>
              <Link
                to="/contact"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
                onClick={toggleMenu}
              >
                Contact Us
              </Link>
              <Link
                to="/blog"
                className="block text-lg font-semibold text-gray-800 hover:text-blue-500"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
