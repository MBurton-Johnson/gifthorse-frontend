import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../styles/components/occasionDetailEditGiftModal.css'

const OccasionDetailEditGift = ({ show, gift, onSave, onCancel, occasions, recipients }) => {
    const [giftDetails, setGiftDetails] = useState(gift || {
        name: '',
        price: '',
        currency: '',
        description: '',
        occasion: '',
        datebought: '',
        status: '',
        recipient: '',
    });

    useEffect(() => {
        // If gift is not null or undefined, update giftDetails
        if (gift) {
            setGiftDetails(gift);
        }
    }, [gift]);

    const handleInputChange = (e) => {
        setGiftDetails({ ...giftDetails, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(giftDetails);
    };


    return (
        <Modal className="occasionDetailEditGiftModal" show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Gift</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input 
                            type="text" 
                            name="name"
                            value={giftDetails.name}
                            onChange={handleInputChange}
                            placeholder="Gift Name"
                        />
                        <input 
                            type="number" 
                            name="price"
                            value={giftDetails.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                        />
                        <input 
                            type="text" 
                            name="currency"
                            value={giftDetails.currency}
                            onChange={handleInputChange}
                            placeholder="Currency"
                        />
                        <textarea 
                            name="description"
                            value={giftDetails.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                        />
                        <input 
                            type="date" 
                            name="datebought"
                            value={giftDetails.datebought}
                            onChange={handleInputChange}
                        />
                        <select 
                            name="status"
                            value={giftDetails.status}
                            onChange={handleInputChange}
                        >
                            <option value="Bought">Bought</option>
                            <option value="Given">Given</option>
                            <option value="Wish List">Wish List</option>
                        </select>
                        <select 
                            name="occasion"
                            value={giftDetails.occasion}
                            onChange={handleInputChange}
                        >
                            {occasions.map((occasion) => (
                                <option key={occasion.id} value={occasion.id}>
                                    {occasion.name}
                                </option>
                            ))}
                        </select>
                        <select 
                            name="recipient"
                            value={giftDetails.recipient}
                            onChange={handleInputChange}
                        >
                            {recipients.map((recipient) => (
                                <option key={recipient.id} value={recipient.id}>
                                    {recipient.name}
                                </option>
                            ))}
                        </select>
                    </Modal.Body>
                    <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OccasionDetailEditGift;

