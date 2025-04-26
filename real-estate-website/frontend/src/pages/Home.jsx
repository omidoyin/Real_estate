import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [lands, setLands] = useState([]);
  const [pastLands, setPastLands] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const landsResponse = await axios.get("/api/lands/active");
        setLands(landsResponse.data);

        // Dummy data for other lists
        setPastLands([
          {
            id: 1,
            title: "Sold Land 1",
            location: "City A",
            price: 100000,
            image: "path/to/image1.jpg",
          },
          {
            id: 2,
            title: "Sold Land 2",
            location: "City B",
            price: 150000,
            image: "path/to/image2.jpg",
          },
        ]);

        setAnnouncements([
          {
            id: 1,
            title: "Promo on Land A",
            description: "Get 10% off on Land A this month!",
          },
          {
            id: 2,
            title: "New Land Available",
            description: "Check out our latest addition to the listings.",
          },
        ]);

        setTeams([
          { id: 1, name: "John Doe", role: "CEO", image: "path/to/team1.jpg" },
          {
            id: 2,
            name: "Jane Smith",
            role: "Marketing Head",
            image: "path/to/team2.jpg",
          },
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-16">
      {/* Hero Section */}
      <section
        className="hero bg-cover bg-center h-96 flex items-center justify-center text-white text-center rounded-lg shadow-lg"
        style={{ backgroundImage: "url('/path/to/hero-image.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded">
          <h1 className="text-5xl font-extrabold mb-4">
            Find Your Dream Land Today
          </h1>
          <p className="text-xl mb-6">
            Explore the best real estate deals with us
          </p>
          <button className="bg-yellow-500 text-black py-3 px-6 rounded-lg font-bold hover:bg-yellow-600">
            Get Started
          </button>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Latest Announcements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(announcements) &&
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-2xl font-semibold mb-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-700">{announcement.description}</p>
              </div>
            ))}
        </div>
      </section>

      {/* Available Lands Section */}
      <section className="available-lands">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Lands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(lands) &&
            lands.map((land) => (
              <div
                key={land.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={land.image}
                  alt={land.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{land.title}</h3>
                  <p className="text-gray-600">Location: {land.location}</p>
                  <p className="text-lg font-bold">${land.price}</p>
                  <Link
                    to={`/lands/details/${land.id}`}
                    className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Past Lands Section */}
      <section className="past-lands">
        <h2 className="text-3xl font-bold mb-6 text-center">Past Lands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(pastLands) &&
            pastLands.map((land) => (
              <div
                key={land.id}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={land.image}
                  alt={land.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{land.title}</h3>
                  <p className="text-gray-600">Location: {land.location}</p>
                  <p className="text-lg font-bold">${land.price}</p>
                  <Link
                    to={`/lands/details/${land.id}`}
                    className="mt-4 inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Our Services Section */}
      <section className="our-services my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Property Listings</h3>
            <p className="text-gray-700">
              Explore a wide range of properties tailored to your needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Consultation</h3>
            <p className="text-gray-700">
              Get expert advice on buying, selling, or investing in real estate.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Legal Assistance</h3>
            <p className="text-gray-700">
              Ensure smooth and secure transactions with our legal support.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about text-center">
        <h2 className="text-3xl font-bold mb-6">About Us</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          We are a leading real estate company dedicated to helping you find
          your dream property. With years of experience and a team of experts,
          we ensure the best deals and services for our clients.
        </p>
      </section>

     

      {/* Achievements Section */}
      <section className="achievements my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Our Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">10,000+</h3>
            <p className="text-gray-700">Happy Customers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">500+</h3>
            <p className="text-gray-700">Lands Sold</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">20+</h3>
            <p className="text-gray-700">Years of Experience</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Written Testimonials */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "The best real estate company I have ever worked with. Highly
              recommended!"
            </p>
            <p className="text-right text-gray-600 mt-4">- John Doe</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "Amazing service and great deals. I found my dream land!"
            </p>
            <p className="text-right text-gray-600 mt-4">- Jane Smith</p>
          </div>
        </div>

        {/* Video Testimonials */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Video Testimonials
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <video controls className="w-full rounded-lg shadow-md">
              <source src="/path/to/testimonial1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <video controls className="w-full rounded-lg shadow-md">
              <source src="/path/to/testimonial2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Get the Latest Gist and Land Updates!
        </h2>
        <form className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full font-bold"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Contact Section */}
      <section className="contact my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Email us at:{" "}
            <a
              href="mailto:info@realestate.com"
              className="text-blue-500 underline"
            >
              info@realestate.com
            </a>
          </p>
          <p className="text-lg text-gray-700">
            Call or WhatsApp us:{" "}
            <a href="tel:+1234567890" className="text-blue-500 underline">
              +123 456 7890
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
