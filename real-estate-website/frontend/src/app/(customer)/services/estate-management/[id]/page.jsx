"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "../../../../../context/ToastContext";

// Function to fetch mock estate management service details
async function fetchEstateManagementDetailsFromAPI(id) {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data based on the ID
  const serviceDetails = {
    id: parseInt(id),
    title: `Commercial Complex Management ${id}`,
    description:
      "Our comprehensive commercial complex management service provides end-to-end solutions for property owners and investors. We handle everything from tenant relations and lease management to maintenance coordination and financial reporting, ensuring your commercial property operates efficiently and profitably.",
    propertyType: "Commercial",
    location: `City ${id}`,
    image: "/placeholder.jpg",
    features: [
      "Tenant acquisition and retention",
      "Lease administration and renewals",
      "Rent collection and financial reporting",
      "Maintenance coordination and vendor management",
      "Security management",
      "Compliance with regulations",
      "Regular property inspections",
      "24/7 emergency response",
    ],
    benefits: [
      "Increased property value",
      "Maximized rental income",
      "Reduced operational costs",
      "Improved tenant satisfaction",
      "Minimized legal risks",
      "Enhanced property appearance",
    ],
    testimonials: [
      {
        name: "John Smith",
        company: "ABC Investments",
        text: "Their management services have significantly improved our property's performance and tenant satisfaction.",
      },
      {
        name: "Sarah Johnson",
        company: "XYZ Properties",
        text: "Professional, responsive, and thorough. They've made managing our commercial complex hassle-free.",
      },
    ],
    contactPerson: "Michael Brown",
    contactEmail: "michael@example.com",
    contactPhone: "+1 (555) 123-4567",
  };

  return serviceDetails;
}

export default function EstateManagementDetails({ params }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Check if we have a valid ID
    if (!params.id) {
      setError("Invalid service ID");
      setLoading(false);
      return;
    }

    // Fetch service details
    const getServiceData = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the API call
        // const data = await getEstateManagementDetails(params.id);

        // For now, use the mock function
        const data = await fetchEstateManagementDetailsFromAPI(params.id);
        setService(data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details. Please try again later.");
        showToast("Failed to load service details", "error");
      } finally {
        setLoading(false);
      }
    };

    getServiceData();
  }, [params.id, showToast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error || "Failed to load service details. Please try again later."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/portfolio?service=estateManagement"
          className="text-primary hover:text-primary-text"
        >
          ← Back to Estate Management Services
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-4">{service.location}</p>

          <div className="mb-8">
            <div className="h-96 bg-gray-300 mb-4 relative">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div className="h-96 bg-gray-300"></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Service Details</h2>
              <p className="text-gray-700 mb-6">{service.description}</p>

              <h3 className="text-xl font-bold mb-3">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-text mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Benefits</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-text mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Testimonials</h3>
              <div className="space-y-4 mb-6">
                {service.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="italic mb-2">"{testimonial.text}"</p>
                    <p className="font-semibold">
                      {testimonial.name}, {testimonial.company}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-card-bg p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Service Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">Property Type</p>
                  <p className="text-xl font-bold">{service.propertyType}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Location</p>
                  <p className="text-xl">{service.location}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Contact Person</p>
                  <p className="text-xl">{service.contactPerson}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Email</p>
                  <p className="text-xl">{service.contactEmail}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Phone</p>
                  <p className="text-xl">{service.contactPhone}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <Link
                    href="/contact"
                    className="block w-full bg-primary-text text-white text-center py-3 rounded-lg hover:bg-green-600"
                  >
                    Inquire Now
                  </Link>
                  <Link
                    href={`tel:${service.contactPhone.replace(/\D/g, "")}`}
                    className="block w-full bg-primary text-white text-center py-3 rounded-lg hover:bg-blue-700"
                  >
                    Call Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
