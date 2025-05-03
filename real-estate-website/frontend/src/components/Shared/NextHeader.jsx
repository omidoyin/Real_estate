"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { isAuthenticated } from "../../utils/auth";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status on client side
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-blue">
          Real Estate
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent-green">
            Home
          </Link>
          <Link href="/about" className="hover:text-accent-green">
            About
          </Link>
          <Link href="/lands/available" className="hover:text-accent-green">
            Available Lands
          </Link>
          <Link href="/why-us" className="hover:text-accent-green">
            Why Us
          </Link>
          <Link href="/blog" className="hover:text-accent-green">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-accent-green">
            Contact
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/favorites"
                className="hover:text-accent-green flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Favorites
              </Link>
              <Link
                href="/my-portfolio"
                className="hover:text-accent-green flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                My Portfolio
              </Link>
              <Link
                href="/dashboard/profile"
                className="hover:text-accent-green"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-accent-green">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-4 py-2 bg-white">
          <nav className="flex flex-col space-y-3">
            <Link href="/" className="hover:text-accent-green">
              Home
            </Link>
            <Link href="/about" className="hover:text-accent-green">
              About
            </Link>
            <Link href="/lands/available" className="hover:text-accent-green">
              Available Lands
            </Link>
            <Link href="/why-us" className="hover:text-accent-green">
              Why Us
            </Link>
            <Link href="/blog" className="hover:text-accent-green">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-accent-green">
              Contact
            </Link>
            <div className="pt-3 border-t border-gray-200 flex flex-col space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/favorites"
                    className="hover:text-accent-green flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Favorites
                  </Link>
                  <Link
                    href="/my-portfolio"
                    className="hover:text-accent-green flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    My Portfolio
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="hover:text-accent-green"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-accent-green">
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-accent-green text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
