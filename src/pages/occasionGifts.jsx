import React, { useState, useEffect } from 'react';
import '../styles/pages/occasionGifts.css';
import { useParams } from 'react-router-dom';

const OccasionGifts = () => {
    const { occasionId } = useParams();
    const [groupedGifts, setGroupedGifts] = useState({});
    const [occasionName, setOccasionName] = useState('');

    useEffect(() => {
        fetch(`http://localhost:8000/gifts-for-occasion/${occasionId}`)
            .then(response => response.json())
            .then(data => {
                // Group gifts by recipient and then by status
                const newGroupedGifts = data.reduce((acc, gift) => {
                    const recipient = gift.recipient_name;
                    const status = gift.status;

                    if (!acc[recipient]) {
                        acc[recipient] = {};
                    }
                    if (!acc[recipient][status]) {
                        acc[recipient][status] = [];
                    }
                    acc[recipient][status].push(gift);

                    return acc;
                }, {});

                setGroupedGifts(newGroupedGifts);
            })
            .catch(error => console.error('Error:', error));

        // Fetch occasion name
        fetch(`http://localhost:8000/occasions/${occasionId}`)
            .then(response => response.json())
            .then(data => {
                setOccasionName(data.name);
            })
            .catch(error => console.error('Error fetching occasion name:', error));
    }, [occasionId]);

    return (
        <div className="occasionGiftsContainer">
            <h1>Gifts for <span className="occasionName">{occasionName}</span></h1>
            {Object.keys(groupedGifts).map(recipient => (
                <div key={recipient}>
                    <h2>{recipient}</h2>
                    {['Bought', 'Given', 'Wish List'].map(status => (
                        groupedGifts[recipient][status] && groupedGifts[recipient][status].length > 0 && (
                            <div key={status}>
                                <h3>{status}</h3>
                                <ul>
                                    {groupedGifts[recipient][status].map(gift => (
                                        <li key={gift.id}>{gift.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )
                    ))}
                </div>
            ))}
        </div>
    );
};

export default OccasionGifts;
