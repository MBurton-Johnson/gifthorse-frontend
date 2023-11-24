import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PencilSquare, Trash } from 'react-bootstrap-icons'; // Import edit and delete icons
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
    const [showAddModal, setShowAddModal] = useState(false); // State to control the modal
    const [newOccasion, setNewOccasion] = useState({ name: '', date: '' }); // State for new occasion data
    const [showEditModal, setShowEditModal] = useState(false); // For edit modal
    const [editingOccasion, setEditingOccasion] = useState({ id: null, name: '', date: '' }); // For editing occasion
    
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/occasions/')
            .then(response => response.json())
            .then(data => {
                const groupedData = groupOccasionsByYearAndMonth(data);
                setGroupedOccasions(groupedData);
            })
            .catch(error => console.error('Error fetching occasions:', error));
    }, []);
    
    const handleAddNewOccasionClick = () => {
        setShowAddModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowAddModal(false); // Close the modal
    };

    const handleNewOccasionChange = (e) => {
        setNewOccasion({ ...newOccasion, [e.target.name]: e.target.value });
    };

    const handleNewOccasionSubmit = async () => {
        try {
            // Make a POST request to your server
            const response = await fetch('http://localhost:8000/occasions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization headers if needed
                },
                body: JSON.stringify(newOccasion)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            // Parse the response
            const data = await response.json();
    
            // Optionally, do something with the response data
            console.log(data);
    
            // Close the modal
            setShowAddModal(false);
    
            // Reset the newOccasion state to clear the form
            setNewOccasion({ name: '', date: '' });
    
            // Refresh the occasions list to include the newly added occasion
            // This could be done by re-fetching the occasions or by adding the new occasion to the existing state
            // Here is a basic example of how you might add it directly to the state:
            const updatedOccasions = { ...groupedOccasions };
            const occasionYear = new Date(newOccasion.date).getFullYear();
            const occasionMonth = new Date(newOccasion.date).toLocaleString('default', { month: 'long' });
            if (!updatedOccasions[occasionYear]) {
                updatedOccasions[occasionYear] = {};
            }
            if (!updatedOccasions[occasionYear][occasionMonth]) {
                updatedOccasions[occasionYear][occasionMonth] = [];
            }
            updatedOccasions[occasionYear][occasionMonth].push(data);
            setGroupedOccasions(updatedOccasions);
    
        } catch (error) {
            console.error('Error adding new occasion:', error);
        }
    };

    const handleEditOccasionClick = (event, occasion) => {
        event.stopPropagation(); // Prevent event from bubbling up
        setEditingOccasion(occasion);
        setShowEditModal(true);
    };    

    const handleDeleteOccasion = async (event, occasionId) => {
        event.stopPropagation(); // Stop event from bubbling up

        if (window.confirm("Are you sure you want to delete this occasion?")) {
            try {
                const response = await fetch(`http://localhost:8000/occasions/${occasionId}`, {
                    method: 'DELETE',
                    // Include any necessary headers, such as authorization headers
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
    
                // Update local state to remove deleted occasion
                const updatedOccasions = { ...groupedOccasions };
                for (const year in updatedOccasions) {
                    for (const month in updatedOccasions[year]) {
                        updatedOccasions[year][month] = updatedOccasions[year][month].filter(occasion => occasion.id !== occasionId);
                    }
                }
                setGroupedOccasions(updatedOccasions);
    
            } catch (error) {
                console.error('Error deleting occasion:', error);
            }
        }
    };
    
    const handleEditSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/occasions/${editingOccasion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any necessary headers, such as authorization headers
                },
                body: JSON.stringify(editingOccasion)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const updatedOccasion = await response.json();
    
            // Update local state
            const updatedOccasions = { ...groupedOccasions };
            const occasionYear = new Date(updatedOccasion.date).getFullYear();
            const occasionMonth = new Date(updatedOccasion.date).toLocaleString('default', { month: 'long' });
    
            updatedOccasions[occasionYear][occasionMonth] = updatedOccasions[occasionYear][occasionMonth].map(occasion => 
                occasion.id === updatedOccasion.id ? updatedOccasion : occasion
            );
    
            setGroupedOccasions(updatedOccasions);
            setShowEditModal(false);
    
        } catch (error) {
            console.error('Error updating occasion:', error);
        }
    };
    

    return (
<>
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
                                                <div className="occasionButtonContainer">
                                                    <button 
                                                        className="editButton" 
                                                        onClick={(e) => handleEditOccasionClick(e, occasion)}>
                                                        <PencilSquare />
                                                    </button>
                                                    <button 
                                                        className="deleteButton" 
                                                        onClick={(e) => handleDeleteOccasion(e, occasion.id)}> {/* Pass the event object */}
                                                        X
                                                    </button>

                                                </div>
                                            </li>
                                        ))}

                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                    ))}
            </div>

            <div className="add-occasion-button-container">
                <Button variant="primary" onClick={handleAddNewOccasionClick}>
                    Add New Occasion
                </Button>
            </div>

            {/* Add New Occasion Modal */}
            <Modal show={showAddModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Occasion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label>Occasion Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={newOccasion.name}
                                onChange={handleNewOccasionChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Occasion Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={newOccasion.date}
                                onChange={handleNewOccasionChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleNewOccasionSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
                        {/* Edit Occasion Modal */}
                        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Occasion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                    <div className="form-group">
                        <label>Occasion Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={editingOccasion.name}
                            onChange={(e) => setEditingOccasion({ ...editingOccasion, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Occasion Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={editingOccasion.date}
                            onChange={(e) => setEditingOccasion({ ...editingOccasion, date: e.target.value })}
                        />
                    </div>
                        </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MyOccasions;
