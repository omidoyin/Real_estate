import React, { useEffect, useState } from "react";
import axios from "axios";
import LandCard from "./LandCard";

const AvailableLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get("/api/lands"); // Adjust the API endpoint as necessary
        setLands(response.data);
      } catch (err) {
        setError("Failed to fetch lands");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="custom-grid">
      {lands.map((land) => (
        <LandCard key={land.id} land={land} />
      ))}
    </div>
  );
};

export default AvailableLands;
