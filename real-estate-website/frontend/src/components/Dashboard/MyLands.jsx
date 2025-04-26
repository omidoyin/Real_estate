import React, { useEffect, useState } from 'react';
import { getMyLands } from '../../utils/api';

const MyLands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyLands = async () => {
            try {
                const response = await getMyLands();
                setLands(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyLands();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="my-lands">
            <h2 className="text-2xl font-bold mb-4">My Lands</h2>
            <ul>
                {lands.map((land) => (
                    <li key={land._id} className="border p-4 mb-2">
                        <h3 className="text-xl">{land.title}</h3>
                        <p>Location: {land.location}</p>
                        <p>Price: ${land.price}</p>
                        <p>Purchase Date: {new Date(land.purchaseDate).toLocaleDateString()}</p>
                        {land.titleDownload && (
                            <a href={land.titleDownload} className="text-blue-500 underline">
                                Download Title
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyLands;