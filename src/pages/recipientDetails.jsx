import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedRecipient, setEditedRecipient] = useState({ name: '', relation: '' });
    
    const navigate = useNavigate();

    const handleOccasionClick = (occasionId) => {
        navigate(`/occasion-details/${recipientId}/${occasionId}`);
    };

    const handleEditClick = () => {
    setShowEditModal(true);
};
    useEffect(() => {
        // Fetch occasions
        fetch(`http://localhost:8000/recipient-occasions/${recipientId}`)
        .then(response => response.json())
        .then(data => {
            const groupedData = groupOccasionsByYear(data);
            setOccasions(groupedData);
        })
        .catch(error => console.error('Error fetching occasions:', error));

        // Fetch recipient's name
        fetch(`http://localhost:8000/recipients/${recipientId}`)
            .then(response => response.json())
            .then(data => {
                setRecipientName(data.name);
                setEditedRecipient({ name: data.name, relation: data.relation });
            })
                .catch(error => console.error('Error fetching recipient:', error));
    }, [recipientId]);

    const handleEditSave = () => {
        // API call to update recipient details
        fetch(`http://localhost:8000/recipients/${recipientId}`, {
            method: 'PUT', // or 'PATCH'
            headers: {
                'Content-Type': 'application/json',
                // Include auth headers if required
            },
            body: JSON.stringify(editedRecipient)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            setRecipientName(data.name); // Update the recipient name on the page
            // handle relation update if necessary
            setShowEditModal(false);
        })
        .catch(error => console.error('Error updating recipient:', error));
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this recipient?")) {
            fetch(`http://localhost:8000/recipients/${recipientId}`, {
                method: 'DELETE',
                // Include auth headers if required
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                // Redirect or update UI after successful deletion
            })
            .catch(error => console.error('Error deleting recipient:', error));
        }
    };    
    
    return (
        <div>
            <div className="recipientDetailsContainer">
                <h1>{recipientName}</h1>
                {Object.keys(occasions).map(year => (
                    <div key={year}>
                        <h2>{year}</h2>
                        <ul>
                            {occasions[year].map(occasion => (
                                <li key={occasion.id} onClick={() => handleOccasionClick(occasion.id)}>
                                    {occasion.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
       
        <div className="buttonContainer">
            <Button variant="primary" onClick={handleEditClick}>Edit Recipient</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Recipient</Button>
        </div>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Recipient</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <form>
            <div className="form-group">
                <label>Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={editedRecipient.name} 
                    onChange={e => setEditedRecipient({...editedRecipient, name: e.target.value})} 
                />
                <label>Relation</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={editedRecipient.relation} 
                    onChange={e => setEditedRecipient({...editedRecipient, relation: e.target.value})} 
                />
            </div>
        </form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
        <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
    </Modal.Footer>
</Modal>

        </div>
        
        
    );
};

export default RecipientDetails;
