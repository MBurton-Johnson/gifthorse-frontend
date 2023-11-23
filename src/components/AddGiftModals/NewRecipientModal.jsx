import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const NewRecipientModal = ({ show, handleClose, handleSave }) => {
    const [newRecipient, setNewRecipient] = useState('');
    const [newRelation, setNewRelation] = useState('');

    const handleSubmit = () => {
        handleSave(newRecipient, newRelation);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Recipient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className="form-control"
                    placeholder="Recipient Name"
                />
                <input
                    type="text"
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="form-control"
                    placeholder="Relation"
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

export default NewRecipientModal;
