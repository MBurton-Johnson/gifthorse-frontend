import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const NewOccasionModal = ({ show, handleClose, handleSave }) => {
    const [newOccasion, setNewOccasion] = useState('');
    const [occasionDate, setOccasionDate] = useState('');

    const handleSubmit = () => {
        handleSave(newOccasion, occasionDate);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Occasion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={newOccasion}
                    onChange={(e) => setNewOccasion(e.target.value)}
                    className="form-control"
                    placeholder="Occasion Name"
                />
                <input
                    type="date"
                    value={occasionDate}
                    onChange={(e) => setOccasionDate(e.target.value)}
                    className="form-control"
                    placeholder="Occasion Date"
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewOccasionModal;
