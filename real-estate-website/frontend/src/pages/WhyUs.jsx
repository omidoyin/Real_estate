import React, { useState, useEffect } from "react";
import axios from "axios";

const WhyUs = () => {
  const [teams, setTeams] = useState([]);

  // useEffect(() => {
  //     const fetchTeams = async () => {
  //         try {
  //             const response = await axios.get("/api/teams"); // Adjust the endpoint as necessary
  //             setTeams(response.data);
  //         } catch (error) {
  //             console.error("Error fetching teams:", error);
  //         }
  //     };

  //     fetchTeams();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      <section className="why-us my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us?</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          We are committed to providing the best real estate services with a
          focus on customer satisfaction, transparency, and trust. Our team of
          experts ensures that you get the best deals and a seamless experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Our Core Values</h3>
            <p className="text-gray-700">
              Integrity, Excellence, and Innovation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700">
              To help individuals and families find their dream properties with
              ease and confidence.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-700">
              To be the most trusted and innovative real estate company
              globally.
            </p>
          </div>
        </div>
      </section>

      <section className="teams my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(teams) &&
            teams.map((team) => (
              <div key={team.id} className="text-center">
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-gray-600">{team.role}</p>
              </div>
            ))}
        </div>
        <div className="text-center mt-6">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Join Our Team
          </button>
        </div>
      </section>

      {/* Teams Section */}
      <section className="teams my-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {Array.isArray(teams) &&
            teams.map((team) => (
              <div key={team.id} className="text-center">
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-gray-600">{team.role}</p>
              </div>
            ))}
        </div>
        <div className="text-center mt-6">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Join Our Team
          </button>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
