import React, { useState, useEffect } from 'react';
import '../styles/pages/myOccasions.css'; 

const groupOccasionsByYear = (occasions) => {
    // Sort occasions by date in descending order
    const sortedOccasions = occasions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by year
    return sortedOccasions.reduce((acc, occasion) => {
        const year = new Date(occasion.date).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(occasion);
        return acc;
    }, {});
};

const MyOccasions = () => {
    const [groupedOccasions, setGroupedOccasions] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/occasions/')
            .then(response => response.json())
            .then(data => {
                const groupedData = groupOccasionsByYear(data);
                setGroupedOccasions(groupedData);
            })
            .catch(error => console.error('Error fetching occasions:', error));
    }, []);

    return (
        <div className="myOccasionsContainer">
            <h1>My Occasions</h1>
            {Object.keys(groupedOccasions).map(year => (
                <div key={year}>
                    <h2>{year}</h2>
                    <ul>
                        {groupedOccasions[year].map(occasion => (
                            <li key={occasion.id}>{occasion.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MyOccasions;
