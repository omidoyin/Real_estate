"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "../../../../../context/ToastContext";

// Function to fetch mock general contracts service details
async function fetchGeneralContractsDetailsFromAPI(id) {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data based on the ID
  const serviceDetails = {
    id: parseInt(id),
    title: `Residential Construction Service ${id}`,
    description:
      "Our general contracting services provide comprehensive construction solutions for residential properties. From initial planning to final inspection, we manage every aspect of the construction process to ensure high-quality results that meet your specifications, timeline, and budget. Our experienced team of professionals is committed to excellence in craftsmanship and customer satisfaction.",
    contractType: "Residential",
    image: "/placeholder.jpg",
    projectImages: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Complete project management",
      "Quality craftsmanship",
      "Transparent pricing",
      "Adherence to timelines",
      "Building code compliance",
      "Regular progress updates",
      "Warranty on workmanship",
      "Post-construction support",
    ],
    services: [
      "New home construction",
      "Home additions",
      "Kitchen and bathroom remodeling",
      "Basement finishing",
      "Outdoor living spaces",
      "Custom cabinetry and millwork",
      "Roofing and siding",
      "Electrical and plumbing",
    ],
    completedProjects: [
      {
        name: "Modern Family Home",
        location: "Riverside",
        year: "2022",
        description: "3,500 sq ft custom home with 4 bedrooms and 3 bathrooms",
      },
      {
        name: "Luxury Kitchen Renovation",
        location: "Highland Park",
        year: "2021",
        description:
          "Complete kitchen remodel with custom cabinetry and high-end appliances",
      },
      {
        name: "Outdoor Entertainment Area",
        location: "Lakeside Community",
        year: "2023",
        description: "Custom deck, outdoor kitchen, and pool installation",
      },
    ],
    projectManager: "David Wilson",
    contactEmail: "david@example.com",
    contactPhone: "+1 (555) 345-6789",
    estimatedTimeline: "3-6 months (depending on project scope)",
  };

  return serviceDetails;
}

export default function GeneralContractsDetails({ params }) {
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
        // const data = await getGeneralContractsDetails(params.id);

        // For now, use the mock function
        const data = await fetchGeneralContractsDetailsFromAPI(params.id);
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
          href="/portfolio?service=generalContracts"
          className="text-primary hover:text-primary-text"
        >
          ← Back to General Contracting Services
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-4">
            Contract Type: {service.contractType}
          </p>

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

            <div className="grid grid-cols-3 gap-4">
              {service.projectImages.map((image, index) => (
                <div key={index} className="h-24 bg-gray-300 relative">
                  {image ? (
                    <Image
                      src={image}
                      alt={`Project image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="h-24 bg-gray-300"></div>
                  )}
                </div>
              ))}
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

              <h3 className="text-xl font-bold mb-3">Services Offered</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {service.services.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mb-3">Completed Projects</h3>
              <div className="space-y-4 mb-6">
                {service.completedProjects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg">{project.name}</h4>
                    <p className="text-gray-600">
                      {project.location} | {project.year}
                    </p>
                    <p className="text-gray-700 mt-2">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-card-bg p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Service Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">Contract Type</p>
                  <p className="text-xl font-bold">{service.contractType}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Project Manager</p>
                  <p className="text-xl">{service.projectManager}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Estimated Timeline</p>
                  <p className="text-xl">{service.estimatedTimeline}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Contact</p>
                  <p className="text-xl">{service.contactEmail}</p>
                  <p className="text-xl">{service.contactPhone}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <Link
                    href="/contact"
                    className="block w-full bg-primary-text text-white text-center py-3 rounded-lg hover:bg-green-600"
                  >
                    Request a Quote
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
