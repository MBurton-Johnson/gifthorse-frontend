import React, { useState, useEffect } from 'react';
import '../styles/pages/occasionGifts.css'; 
import { useParams } from 'react-router-dom';

const OccasionGifts = () => {
    const { occasionId } = useParams(); // Use useParams to get the occasion ID from URL
    const [gifts, setGifts] = useState([]);
    const [occasionName, setOccasionName] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/gifts-for-occasion/${occasionId}`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // Debugging line

                // Assuming each gift has a recipient object with a name property
                const groupedGifts = data.reduce((acc, gift) => {
                    const recipientName = gift.recipient_name; // Use recipient_name directly from gift object
                    if (recipientName) {
                        if (!acc[recipientName]) {
                            acc[recipientName] = [];
                        }
                        acc[recipientName].push(gift);
                    }
                    return acc;
                }, {});

                setGifts(groupedGifts);
            })
            .catch(error => console.error('Error:', error));

            // Fetch occasion name
            fetch(`http://localhost:8000/occasions/${occasionId}`)
            .then(response => response.json())
            .then(data => {
                setOccasionName(data.name); // Assuming the response has a 'name' field
            })
            .catch(error => console.error('Error fetching occasion name:', error));

    }, [occasionId]);

    return (
        <div className="occasionGiftsContainer">
        <h1>Gifts for <span className="occasionName">{occasionName}</span></h1>
            {Object.keys(gifts).map(recipientName => (
                <div key={recipientName}>
                    <h2>{recipientName}</h2>
                    <ul>
                        {gifts[recipientName].map(gift => (
                            <li key={gift.id}>{gift.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default OccasionGifts;
