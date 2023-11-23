import React, { useState, useEffect } from 'react';
import '../styles/pages/myGifts.css';

const MyGifts = () => {
    const [gifts, setGifts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/gifts/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setGifts(data))
            .catch(error => {
                console.error('Error fetching gifts:', error);
                setError('Failed to load gifts. Please try again later.');
            });
    }, []);

    return (
        <div className="myGiftsContainer">
            <h1>My Gifts</h1>
            {error && <div className="error">{error}</div>}

            <ul>
                {gifts.map(gift => (
                    <li key={gift.id}>
                        Gift: {gift.name}, Price: {gift.price}, Recipient: {gift.recipient_name}, Occasion: {gift.occasion_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyGifts;
