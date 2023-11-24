import React, { useState, useEffect } from 'react';
import '../styles/pages/myGifts.css';

const MyGifts = () => {
    const [gifts, setGifts] = useState([]);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [statusFilter, setStatusFilter] = useState([]);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const handleStatusDropdown = () => {
        setShowStatusDropdown(!showStatusDropdown);
    };

    const handleClickOutside = (event) => {
        // Logic to close the dropdown when clicking outside
        if (!event.target.closest('.statusFilterDropdown')) {
            setShowStatusDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        fetch('http://localhost:8000/gifts/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (sortConfig !== null) {
                    data.sort((a, b) => {
                        if (sortConfig.key === 'created_at') {
                            const dateA = new Date(a[sortConfig.key]);
                            const dateB = new Date(b[sortConfig.key]);
                            return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
                        } else if (sortConfig.key === 'price') {
                            // Parse the price values into numbers for comparison
                            const priceA = parseFloat(a[sortConfig.key]);
                            const priceB = parseFloat(b[sortConfig.key]);
                            return sortConfig.direction === 'ascending' ? priceA - priceB : priceB - priceA;
                        } else {
                            if (a[sortConfig.key] < b[sortConfig.key]) {
                                return sortConfig.direction === 'ascending' ? -1 : 1;
                            }
                            if (a[sortConfig.key] > b[sortConfig.key]) {
                                return sortConfig.direction === 'ascending' ? 1 : -1;
                            }
                            return 0;
                        }
                    });
                }
                setGifts(data);
            })
            .catch(error => {
                console.error('Error fetching gifts:', error);
                setError('Failed to load gifts. Please try again later.');
            });
    }, [sortConfig]);
    
    
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const toggleStatusFilter = (status) => {
        const newFilter = statusFilter.includes(status)
            ? statusFilter.filter(s => s !== status)
            : [...statusFilter, status];
        setStatusFilter(newFilter);
    };

    const filteredGifts = gifts.filter(gift => 
        statusFilter.length === 0 || statusFilter.includes(gift.status)
    );

    return (
        <div className="myGiftsContainer">
            <h1>My Gifts</h1>
            {error && <div className="error">{error}</div>}

            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>
                            Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={() => requestSort('price')}>
                            Price {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={() => requestSort('recipient_name')}>
                            Recipient {sortConfig.key === 'recipient_name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={() => requestSort('occasion_name')}>
                            Occasion {sortConfig.key === 'occasion_name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                        <th onClick={handleStatusDropdown}>
                            Status {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            {/* Dropdown Icon */}
                        </th>
                        <th onClick={() => requestSort('created_at')}>
                            Date Added {sortConfig.key === 'created_at' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>

                    <tbody>
                        {gifts.map(gift => (
                            <tr key={gift.id}>
                                <td>{gift.name}</td>
                                <td>{gift.price}</td>
                                <td>{gift.recipient_name}</td>
                                <td>{gift.occasion_name}</td>
                                <td>{gift.status}</td>
                                <td>{new Date(gift.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
            </table>
            {showStatusDropdown && (
                <div className="statusFilterDropdown">
                    {['Bought', 'Given', 'Wish List'].map(status => (
                        <div key={status}>
                            <input
                                type="checkbox"
                                checked={statusFilter.includes(status)}
                                onChange={() => toggleStatusFilter(status)}
                            />
                            {status}
                        </div>
                    ))}
                </div>
            )}

        </div>

    );
};

export default MyGifts;
