import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OccasionDetailEditGift from '../components/EditGiftModal/OccasionDetailEditGift';
import { PencilSquare, XSquare } from 'react-bootstrap-icons'; // Import icons

import '../styles/pages/occasionDetails.css';

const groupGiftsByStatus = (gifts) => {
    // Group gifts by their status
    return gifts.reduce((acc, gift) => {
        if (!acc[gift.status]) {
            acc[gift.status] = [];
        }
        acc[gift.status].push(gift);
        return acc;
    }, {});
};

const OccasionDetails = () => {
    const { recipientId, occasionId } = useParams();
    const [gifts, setGifts] = useState([]);
    const [recipientName, setRecipientName] = useState('');
    const [occasionName, setOccasionName] = useState('');
    const [occasions, setOccasions] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGift, setEditingGift] = useState(null);


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

        // Fetch occasions
            fetch('http://localhost:8000/occasions/')
            .then(response => response.json())
            .then(data => setOccasions(data))
            .catch(error => console.error('Error fetching occasions:', error));

        // Fetch recipients
            fetch('http://localhost:8000/recipients/')
            .then(response => response.json())
            .then(data => setRecipients(data))
            .catch(error => console.error('Error fetching recipients:', error));
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

    const handleEditGift = (giftId) => {
        const giftToEdit = gifts.find(gift => gift.id === giftId);
        if (giftToEdit) {
            setEditingGift(giftToEdit);
            setShowEditModal(true);
        }
    };
    
    const handleEditSave = (updatedGift) => {
        // Logic to save the updated gift to the server
        fetch(`http://localhost:8000/gifts/${updatedGift.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGift)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            setGifts(gifts.map(gift => gift.id === data.id ? data : gift)); // Update state
            setShowEditModal(false); // Close the modal
        })
        .catch(error => console.error('Error updating gift:', error));
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
                    <div>
                        <button 
                            className="editButton" 
                            onClick={() => handleEditGift(gift.id)}
                        >
                            <PencilSquare /> 
                        </button>
                        <button 
                            className="deleteButton" 
                            onClick={() => handleDeleteGift(gift.id)}
                        >
                            X
                        </button>
                    </div>
                    </li>
                ))}
            </ul>
            <OccasionDetailEditGift 
                show={showEditModal} 
                gift={editingGift} 
                onSave={handleEditSave} 
                onCancel={() => setShowEditModal(false)}
                occasions={occasions}
                recipients={recipients}
            />
        </div>
    );
};

export default OccasionDetails;
