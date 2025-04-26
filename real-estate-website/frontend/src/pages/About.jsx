import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="mb-4">
                Welcome to our real estate company! We are dedicated to helping you find your dream property.
                Our team of experienced professionals is here to guide you through every step of the buying process.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="mb-4">
                Our mission is to provide exceptional service and support to our clients, ensuring a seamless
                and enjoyable experience in the real estate market.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
            <ul className="list-disc list-inside mb-4">
                <li>Integrity</li>
                <li>Transparency</li>
                <li>Customer Satisfaction</li>
                <li>Innovation</li>
            </ul>
            <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
            <p>
                If you have any questions or need assistance, feel free to reach out to us at 
                <a href="mailto:info@realestatecompany.com" className="text-blue-500"> info@realestatecompany.com</a>.
            </p>
        </div>
    );
};

export default About;