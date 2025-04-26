import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLandDetails = async () => {
            try {
                const response = await axios.get(`/api/lands/${id}`);
                setLand(response.data);
            } catch (err) {
                setError('Error fetching land details');
            } finally {
                setLoading(false);
            }
        };

        fetchLandDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{land.title}</h1>
            <div className="image-gallery">
                {land.images.map((image, index) => (
                    <img key={index} src={image} alt={land.title} className="w-full h-auto" />
                ))}
            </div>
            <div className="video-player">
                {land.video && (
                    <video controls className="w-full h-auto">
                        <source src={land.video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            <div className="details mt-4">
                <h2 className="text-xl font-semibold">Location: {land.location}</h2>
                <p className="text-lg">Price: ${land.price}</p>
                <p className="mt-2">{land.description}</p>
                <h3 className="mt-4 font-semibold">Inspection Dates:</h3>
                <ul>
                    {land.inspectionDates.map((date, index) => (
                        <li key={index}>{date}</li>
                    ))}
                </ul>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Book Inspection
                </button>
            </div>
        </div>
    );
};

export default LandDetails;