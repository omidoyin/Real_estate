"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { removeToken } from "../../../utils/auth";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, this would fetch user data from an API or context
    setUser({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
  }, []);

  const navItems = [
    { label: "Profile", path: "/dashboard/profile" },
    { label: "My Portfolio", path: "/my-portfolio" },
    { label: "Favorites", path: "/favorites" },
    { label: "Payment Plan", path: "/dashboard/payment-plan" },
    { label: "Payment History", path: "/dashboard/payment-history" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {user ? (
              <div className="mb-6 text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            ) : (
              <div className="mb-6 text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-full py-2 px-4 bg-primary-blue text-white rounded mb-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? "Hide Menu" : "Show Menu"}
            </button>

            {/* Navigation */}
            <nav
              className={`${isMobileMenuOpen ? "block" : "hidden"} md:block`}
            >
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block py-2 px-4 rounded ${
                        pathname === item.path
                          ? "bg-primary-blue text-white"
                          : "hover:bg-light-blue"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
