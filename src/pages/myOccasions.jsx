import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/myOccasions.css'; 

const groupOccasionsByYearAndMonth = (occasions) => {
    const sortedOccasions = occasions.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort in ascending order

    return sortedOccasions.reduce((yearsAcc, occasion) => {
        const date = new Date(occasion.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' }); // 'January', 'February', etc.

        if (!yearsAcc[year]) {
            yearsAcc[year] = {};
        }
        if (!yearsAcc[year][month]) {
            yearsAcc[year][month] = [];
        }
        yearsAcc[year][month].push(occasion);
        return yearsAcc;
    }, {});
};

const monthToNumber = (month) => {
    return new Date(Date.parse(month + " 1, 2000")).getMonth();
};

const MyOccasions = () => {
    const [groupedOccasions, setGroupedOccasions] = useState({});

    useEffect(() => {
        fetch('http://localhost:8000/occasions/')
            .then(response => response.json())
            .then(data => {
                const groupedData = groupOccasionsByYearAndMonth(data);
                setGroupedOccasions(groupedData);
            })
            .catch(error => console.error('Error fetching occasions:', error));
    }, []);
    
const navigate = useNavigate();

    return (
        <div className="myOccasionsContainer">
            <h1>My Occasions</h1>
            {Object.keys(groupedOccasions)
                .sort((a, b) => b - a) // Sort years in descending order
                .map(year => (
                    <div key={year} className="yearSection">
                        <h2 className="yearHeading">{year}</h2>
                        {Object.keys(groupedOccasions[year])
                            .sort((a, b) => monthToNumber(b) - monthToNumber(a)) // Sort months in descending order
                            .map(month => (
                                <div key={month} className="monthSection">
                                    <h3 className="monthHeading">{month}</h3>

                                    <ul>
                                        {groupedOccasions[year][month].map(occasion => (
                                            <li key={occasion.id} onClick={() => navigate(`/occasion-gifts/${occasion.id}`)}>
                                                {occasion.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                ))}
        </div>
    );
};

export default MyOccasions;
