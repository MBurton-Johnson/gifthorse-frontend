import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/pages/recipientDetails.css';

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

const RecipientDetails = () => {
    const { recipientId } = useParams(); // Get recipientId from URL parameters
    const [occasions, setOccasions] = useState([]);
    const [recipientName, setRecipientName] = useState('');

    useEffect(() => {
        // Fetch occasions
        fetch(`http://localhost:8000/occasions?recipient=${recipientId}`)
            .then(response => response.json())
            .then(data => {
                const groupedData = groupOccasionsByYear(data);
                setOccasions(groupedData);
            })
            .catch(error => console.error('Error fetching occasions:', error));

        // Fetch recipient's name
        fetch(`http://localhost:8000/recipients/${recipientId}`)
            .then(response => response.json())
            .then(data => setRecipientName(data.name)) // Adjust based on your API response
            .catch(error => console.error('Error fetching recipient:', error));
    }, [recipientId]);

    return (
        <div className="recipientDetailsContainer">
            <h1>{recipientName}</h1>
            {Object.keys(occasions).map(year => (
                <div key={year}>
                    <h2>{year}</h2>
                    <ul>
                        {occasions[year].map(occasion => (
                            <li key={occasion.id}>{occasion.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default RecipientDetails;
