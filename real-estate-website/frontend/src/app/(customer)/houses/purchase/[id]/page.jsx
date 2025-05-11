"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getHouseDetails } from "@/utils/api";
import { isAuthenticated } from "@/utils/auth";
import PaymentProcessor from "@/components/Payment/PaymentProcessor";
import { useToast } from "@/context/ToastContext";

export default function PurchaseHouse({ params }) {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      showToast("Please log in to purchase properties", "warning");
      router.push("/auth/login");
      return;
    }

    // Fetch house details
    const fetchHouseDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your API
        // const data = await getHouseDetails(params.id);

        // For demo purposes, use mock data
        const data = {
          id: parseInt(params.id),
          title: `Modern House in Location ${params.id}`,
          description:
            "This beautiful property offers modern living spaces with high-quality finishes throughout. Featuring an open floor plan, abundant natural light, and premium fixtures, this home provides the perfect balance of comfort and style.",
          price: 450000 + parseInt(params.id) * 50000,
          size: "250 sqm",
          location: `City ${params.id}, State X`,
          bedrooms: 3 + (parseInt(params.id) % 3),
          bathrooms: 2 + (parseInt(params.id) % 2),
          image: "/placeholder.jpg",
          propertyType: "Single Family Home",
          yearBuilt: 2020 + (parseInt(params.id) % 3),
        };

        setHouse(data);
      } catch (err) {
        console.error("Error fetching house details:", err);
        setError("Failed to load property details. Please try again later.");
        showToast("Failed to load property details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [params.id, router, showToast]);

  const handlePaymentComplete = (details) => {
    setPaymentComplete(true);
    setPaymentDetails(details);

    // Set transaction ID and payment date for display
    setTransactionId(
      details.transactionId || "TXN" + Math.floor(Math.random() * 1000000)
    );
    setPaymentDate(new Date(details.date).toLocaleDateString());

    showToast(
      "Payment successful! Property added to your portfolio.",
      "success"
    );

    // In a real app, you would update the user's portfolio here
    // and redirect to the portfolio page after a delay
    setTimeout(() => {
      router.push("/my-portfolio");
    }, 5000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Purchase Property</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
        </div>
      </div>
    );
  }

  if (error || !house) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Purchase Property</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error || "Failed to load property details. Please try again later."}
        </div>
        <div className="mt-6">
          <Link
            href="/portfolio?service=houses"
            className="text-primary-blue hover:underline"
          >
            ← Back to Available Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Purchase Property</h1>

      <div className="mb-6">
        <Link
          href={`/houses/details/${house.id}`}
          className="text-primary-blue hover:underline"
        >
          ← Back to Property Details
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64">
            {house.image ? (
              <Image
                src={house.image}
                alt={house.title}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="h-64 bg-gray-300"></div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{house.title}</h2>
            <p className="text-gray-600 mb-4">{house.location}</p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="text-xl font-bold text-primary-blue">
                    ${house.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Size</p>
                  <p className="text-xl font-bold">{house.size}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="text-xl font-bold">{house.bedrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bathrooms</p>
                  <p className="text-xl font-bold">{house.bathrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Property Type</p>
                  <p className="text-xl font-bold">{house.propertyType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year Built</p>
                  <p className="text-xl font-bold">{house.yearBuilt}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{house.description}</p>
            </div>
          </div>
        </div>

        <div>
          {paymentComplete ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Purchase Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! You have successfully purchased {house.title}
                  .
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">
                      ${house.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{paymentDate}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  You will be redirected to your portfolio shortly. If not,
                  click the button below.
                </p>
                <Link
                  href="/my-portfolio"
                  className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-accent-green"
                >
                  View My Portfolio
                </Link>
              </div>
            </div>
          ) : (
            <PaymentProcessor
              property={house}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
