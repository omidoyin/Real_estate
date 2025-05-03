'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PaymentProcessor({ property, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateCardDetails = () => {
    if (cardDetails.cardNumber.length < 16) {
      setError('Please enter a valid card number');
      return false;
    }
    if (cardDetails.cardName.trim() === '') {
      setError('Please enter the name on card');
      return false;
    }
    if (cardDetails.expiryDate.trim() === '') {
      setError('Please enter the expiry date');
      return false;
    }
    if (cardDetails.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    return true;
  };
  
  const validateBankDetails = () => {
    if (bankDetails.accountNumber.length < 8) {
      setError('Please enter a valid account number');
      return false;
    }
    if (bankDetails.routingNumber.length < 9) {
      setError('Please enter a valid routing number');
      return false;
    }
    if (bankDetails.accountName.trim() === '') {
      setError('Please enter the account name');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate based on payment method
    let isValid = false;
    if (paymentMethod === 'creditCard') {
      isValid = validateCardDetails();
    } else if (paymentMethod === 'bankTransfer') {
      isValid = validateBankDetails();
    }
    
    if (!isValid) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call to process payment
      // const response = await fetch('/api/payments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     propertyId: property.id,
      //     amount: property.price,
      //     paymentMethod,
      //     ...(paymentMethod === 'creditCard' ? { cardDetails } : { bankDetails })
      //   })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      setSuccess(true);
      
      // Notify parent component
      if (onPaymentComplete) {
        onPaymentComplete({
          propertyId: property.id,
          amount: property.price,
          paymentMethod,
          date: new Date().toISOString(),
          status: 'completed',
          transactionId: 'TXN' + Math.floor(Math.random() * 1000000)
        });
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your payment for {property.title} has been processed successfully.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">TXN{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${property.price?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-blue text-white px-6 py-3 rounded-lg hover:bg-accent-green"
          >
            Return to Property
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Property</h3>
          <span className="text-xl font-bold text-primary-blue">${property.price?.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-4">
            {property.image ? (
              <Image
                src={property.image}
                alt={property.title}
                width={64}
                height={64}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300"></div>
            )}
          </div>
          <div>
            <h4 className="font-medium">{property.title}</h4>
            <p className="text-gray-600 text-sm">{property.location}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 border rounded-lg flex flex-col items-center ${
              paymentMethod === 'creditCard' 
                ? 'border-primary-blue bg-light-blue' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('creditCard')}
          >
            <svg className="w-8 h-8 mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-medium">Credit Card</span>
          </button>
          
          <button
            type="button"
            className={`p-4 border rounded-lg flex flex-col items-center ${
              paymentMethod === 'bankTransfer' 
                ? 'border-primary-blue bg-light-blue' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setPaymentMethod('bankTransfer')}
          >
            <svg className="w-8 h-8 mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            <span className="font-medium">Bank Transfer</span>
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {paymentMethod === 'creditCard' ? (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                maxLength={16}
              />
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-gray-700 font-medium mb-2">Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-gray-700 font-medium mb-2">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="accountName" className="block text-gray-700 font-medium mb-2">Account Name</label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={bankDetails.accountName}
                onChange={handleBankInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            
            <div>
              <label htmlFor="accountNumber" className="block text-gray-700 font-medium mb-2">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleBankInputChange}
                placeholder="12345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
            
            <div>
              <label htmlFor="routingNumber" className="block text-gray-700 font-medium mb-2">Routing Number</label>
              <input
                type="text"
                id="routingNumber"
                name="routingNumber"
                value={bankDetails.routingNumber}
                onChange={handleBankInputChange}
                placeholder="123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-primary-blue text-white py-3 px-4 rounded-md hover:bg-accent-green transition-colors ${
            isProcessing ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay $${property.price?.toLocaleString()}`
          )}
        </button>
      </form>
    </div>
  );
}
