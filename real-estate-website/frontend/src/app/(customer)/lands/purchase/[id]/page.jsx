'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getLandDetails } from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';
import PaymentProcessor from '@/components/Payment/PaymentProcessor';

export default function PurchaseLand({ params }) {
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push(`/auth/login?redirect=/lands/purchase/${params.id}`);
      return;
    }

    // Fetch land details
    const fetchLandDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your API
        // const data = await getLandDetails(params.id);
        
        // For demo purposes, use mock data
        const data = {
          id: parseInt(params.id),
          title: `Premium Land in Location ${params.id}`,
          description: 'This premium land property is located in a prime area with excellent investment potential. The property features easy access to major roads, proximity to essential amenities, and is situated in a rapidly developing region.',
          price: 250000 + (parseInt(params.id) * 50000),
          size: '500 sqm',
          location: `City ${params.id}, State X`,
          image: '/placeholder.jpg'
        };
        
        setLand(data);
      } catch (err) {
        console.error('Error fetching land details:', err);
        setError('Failed to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLandDetails();
  }, [params.id, router]);

  const handlePaymentComplete = (details) => {
    setPaymentComplete(true);
    setPaymentDetails(details);
    
    // In a real app, you would update the user's portfolio here
    // and redirect to the portfolio page after a delay
    setTimeout(() => {
      router.push('/my-portfolio');
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

  if (error || !land) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Purchase Property</h1>
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error || 'Failed to load property details. Please try again later.'}
        </div>
        <div className="mt-6">
          <Link href="/lands/available" className="text-primary-blue hover:underline">
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
        <Link href={`/lands/details/${land.id}`} className="text-primary-blue hover:underline">
          ← Back to Property Details
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-64">
            {land.image ? (
              <Image
                src={land.image}
                alt={land.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="h-64 bg-gray-300"></div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{land.title}</h2>
            <p className="text-gray-600 mb-4">{land.location}</p>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="text-xl font-bold text-primary-blue">${land.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Size</p>
                  <p className="text-xl font-bold">{land.size}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{land.description}</p>
            </div>
          </div>
        </div>
        
        <div>
          {paymentComplete ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! You have successfully purchased {land.title}.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{paymentDetails?.transactionId || 'TXN' + Math.floor(Math.random() * 1000000)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">${land.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  You will be redirected to your portfolio shortly. If not, click the button below.
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
            <PaymentProcessor property={land} onPaymentComplete={handlePaymentComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
