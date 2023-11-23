import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/myRecipients.css'; 

const groupRecipients = (recipients) => {
    // Sort recipients alphabetically
    const sortedRecipients = recipients.sort((a, b) => a.name.localeCompare(b.name));

    // Group by the first letter of the name
    return sortedRecipients.reduce((acc, recipient) => {
        const firstLetter = recipient.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(recipient);
        return acc;
    }, {});
};

const MyRecipients = () => {
    const [groupedRecipients, setGroupedRecipients] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/recipients/')
            .then(response => response.json())
            .then(data => {
                setGroupedRecipients(groupRecipients(data));
            })
            .catch(error => console.error('Error fetching recipients:', error));
    }, []);

    const navigate = useNavigate();

    const handleRecipientClick = (recipientId) => {
        navigate(`/recipient-details/${recipientId}`);
    };

    return (   
        <div className="myRecipientsContainer">
            <h1>My Recipients</h1>
            {Object.keys(groupedRecipients).map(letter => (
                <div key={letter}>
                    <h2>{letter}</h2>
                    <ul>
                        {groupedRecipients[letter].map(recipient => (
                            <li key={recipient.id} onClick={() => handleRecipientClick(recipient.id)}>
                                {recipient.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MyRecipients;
