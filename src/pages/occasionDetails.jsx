import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/pages/occasionDetails.css';

const OccasionDetails = () => {
    const { recipientId, occasionId } = useParams();
    const [gifts, setGifts] = useState([]);
    const [recipientName, setRecipientName] = useState('');
    const [occasionName, setOccasionName] = useState('');

    useEffect(() => {
        // Fetch gifts
        fetch(`http://localhost:8000/gifts-for-occasion/${occasionId}/recipient/${recipientId}`)
            .then(response => response.json())
            .then(data => setGifts(data))
            .catch(error => console.error('Error:', error));

        // Fetch recipient's name
        fetch(`http://localhost:8000/recipients/${recipientId}`)
            .then(response => response.json())
            .then(data => setRecipientName(data.name))
            .catch(error => console.error('Error fetching recipient:', error));

        // Fetch occasion's name
        fetch(`http://localhost:8000/occasions/${occasionId}`)
            .then(response => response.json())
            .then(data => setOccasionName(data.name))
            .catch(error => console.error('Error fetching occasion:', error));
    }, [recipientId, occasionId]);

    const handleDeleteGift = (giftId) => {
        if (window.confirm("Are you sure you want to delete this gift?")) {
            // Perform the delete operation
            fetch(`http://localhost:8000/gifts/${giftId}`, {
                method: 'DELETE',
                // Include auth headers if required
            })
            .then(response => {
                if (response.ok) {
                    setGifts(gifts.filter(gift => gift.id !== giftId)); // Remove the gift from the state
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .catch(error => console.error('Error deleting gift:', error));
        }
    };
    
    return (
        <div className="occasionDetailsContainer">
            <h1>
                <span className="recipientName">{recipientName}</span>
                {'\'s Gifts for '}
                <span className="occasionName">{occasionName}</span>
            </h1>
            <ul>
                {gifts.map(gift => (
                    <li key={gift.id}>
                        {gift.name} - {gift.price}
                        <button 
                            className="deleteButton" 
                            onClick={() => handleDeleteGift(gift.id)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OccasionDetails;
