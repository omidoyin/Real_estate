"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "../../../../../context/ToastContext";

// Function to fetch mock architectural design service details
async function fetchArchitecturalDesignDetailsFromAPI(id) {
  // In a real app, this would fetch from your API
  // For now, we'll return mock data based on the ID
  const serviceDetails = {
    id: parseInt(id),
    title: `Modern Residential Design ${id}`,
    description:
      "Our architectural design services blend creativity with functionality to create spaces that are both beautiful and practical. We work closely with clients to understand their vision and requirements, delivering innovative designs that exceed expectations while adhering to budget constraints and regulatory requirements.",
    category: "Residential",
    designStyle: "Modern",
    image: "/placeholder.jpg",
    projectImages: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    features: [
      "Custom floor plans",
      "3D visualization",
      "Interior design integration",
      "Sustainable design elements",
      "Building code compliance",
      "Construction documentation",
      "Project management",
      "Post-construction support",
    ],
    process: [
      "Initial consultation and needs assessment",
      "Concept development and schematic design",
      "Design development and refinement",
      "Construction documentation",
      "Bidding and contractor selection",
      "Construction administration",
      "Project completion and evaluation",
    ],
    pastProjects: [
      {
        name: "Lakeside Residence",
        location: "Lake City",
        year: "2022",
      },
      {
        name: "Urban Apartment Complex",
        location: "Downtown Metro",
        year: "2021",
      },
      {
        name: "Hillside Villa",
        location: "Mountain View",
        year: "2020",
      },
    ],
    leadArchitect: "Emily Johnson",
    contactEmail: "emily@example.com",
    contactPhone: "+1 (555) 987-6543",
  };

  return serviceDetails;
}

export default function ArchitecturalDesignDetails({ params }) {
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
        // const data = await getArchitecturalDesignDetails(params.id);

        // For now, use the mock function
        const data = await fetchArchitecturalDesignDetailsFromAPI(params.id);
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
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
          href="/portfolio?service=architecturalDesign"
          className="text-primary-blue hover:text-accent-green"
        >
          ← Back to Architectural Design Services
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-4">
            {service.category} | {service.designStyle}
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
                      className="w-5 h-5 text-accent-green mr-2"
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

              <h3 className="text-xl font-bold mb-3">Our Design Process</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2">
                {service.process.map((step, index) => (
                  <li key={index} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>

              <h3 className="text-xl font-bold mb-3">Past Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {service.pastProjects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-gray-600">
                      {project.location} | {project.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-light-blue p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Service Summary</h2>
                <div className="mb-4">
                  <p className="text-gray-600">Category</p>
                  <p className="text-xl font-bold">{service.category}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Design Style</p>
                  <p className="text-xl font-bold">{service.designStyle}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Lead Architect</p>
                  <p className="text-xl">{service.leadArchitect}</p>
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
                    className="block w-full bg-accent-green text-white text-center py-3 rounded-lg hover:bg-green-600"
                  >
                    Request a Consultation
                  </Link>
                  <Link
                    href={`tel:${service.contactPhone.replace(/\D/g, "")}`}
                    className="block w-full bg-primary-blue text-white text-center py-3 rounded-lg hover:bg-blue-700"
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
