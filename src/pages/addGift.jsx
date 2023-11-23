import React, { useState, useEffect } from 'react';
import '../styles/pages/addGift.css';
import NewOccasionModal from '../components/AddGiftModals/NewOccasionModal'; // Import the modal component
import NewRecipientModal from '../components/AddGiftModals/NewRecipientModal'; // Import the modal component
import AddGiftSuccessModal from '../components/AddGiftModals/AddGiftSuccessModal'; // Import the modal component


const AddGift = () => {
    const [gift, setGift] = useState({
        name: '',
        price: '',
        currency: 'GBP',
        description: '',
        occasion: '',  
        datebought: '',
        status: 'Pending',
        recipient: '',
    });

    const [occasions, setOccasions] = useState([]);
    const [recipients, setRecipients] = useState([]);

    const [showOccasionModal, setShowOccasionModal] = useState(false);
    const [showRecipientModal, setShowRecipientModal] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSaveNewOccasion = async (newOccasionName, newOccasionDate) => {
        // POST new occasion to backend and fetch updated occasions list
        const response = await fetch('http://localhost:8000/occasions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include authorization token if needed
            },
            body: JSON.stringify({ 
                name: newOccasionName,
                date: newOccasionDate
             })
                
        });
    
        if (response.ok) {
            const newOccasion = await response.json();
            setOccasions([...occasions, newOccasion]);
        } else {
            // Handle errors, e.g., show an alert or message
            console.error('Failed to add new occasion');
        }
    };

    const handleSaveNewRecipient = async (newRecipientName, newRelation) => {
        const response = await fetch('http://localhost:8000/recipients/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include authorization token if needed
            },
            body: JSON.stringify({ 
                name: newRecipientName, 
                relation: newRelation
            }) // Adjust the body as per your model
        });
    
        if (response.ok) {
            const newRecipient = await response.json();
            setRecipients([...recipients, newRecipient]);
        } else {
            // Handle errors
            console.error('Failed to add new recipient');
        }
    };

    useEffect(() => {
        // Fetch occasions
        fetch('http://localhost:8000/occasions/')
            .then(response => response.json())
            .then(data => setOccasions(data));

        // Fetch recipients
        fetch('http://localhost:8000/recipients/')
            .then(response => response.json())
            .then(data => setRecipients(data));
    }, []);

    const handleChange = (e) => {
        setGift({ ...gift, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

    // Initialize a variable for the formatted date
        let formattedDate = gift.datebought;

        // Check if the date is in the expected DD/MM/YYYY format
        if (gift.datebought && gift.datebought.includes('/')) {
            const parts = gift.datebought.split('/');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        
        const payload = {
            name: gift.name,
            price: parseFloat(gift.price), // Convert price to a float
            currency: gift.currency,
            description: gift.description,
            occasion: parseInt(gift.occasion), // Assuming this will be an ID
            datebought: formattedDate,
            status: gift.status,
            recipient: parseInt(gift.recipient), // Assuming this will be an ID
        };

        setErrorMessage('');
        
        // Call API to add the gift
        const response = await fetch('http://localhost:8000/gifts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include authorization token if needed
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log('Gift added successfully');

            // Clear form fields
            setGift({
                name: '',
                price: '',
                currency: 'GBP',
                description: '',
                occasion: '',  
                datebought: '',
                status: 'Pending',
                recipient: '',
            });

            // Set success message
            console.log("Before setting showSuccessModal: ", showSuccessModal);
            setShowSuccessModal(true);
            console.log("After setting showSuccessModal: ", showSuccessModal);
            
            // Hide the success message after 3 seconds
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        } else {
            // Handle error
            try {
                const errorData = await response.json();
                // Log or display specific error details
                console.error('Error details:', errorData);
                setErrorMessage('Error occurred: ' + JSON.stringify(errorData));
            } catch (error) {
                setErrorMessage('An error occurred while processing your request.');
            }
            console.error('Error in adding gift');
        }
    }

    return (
        <div className="addGiftContainer">
            <h1 className="addGiftHeader">Add Your Gift</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>} 
                <form onSubmit={handleSubmit} className="addGiftForm">
                    <input type="text" name="name" value={gift.name} onChange={handleChange} placeholder="Gift Name" required className="addGiftInput"/>

                <div className="dropdown-button-container">
                    <select
                        name="recipient"
                        value={gift.recipient}
                        onChange={handleChange}
                        className="addGiftInput"
                        required
                    >
                        <option value="">Select Recipient</option>
                        {recipients.map((recipient) => (
                            <option key={recipient.id} value={recipient.id}>
                                {recipient.name}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={() => setShowRecipientModal(true)} className="addNewButton">
                        Add New
                    </button>
                </div>

                <div className="dropdown-button-container">
                    <select
                        name="occasion"
                        value={gift.occasion}
                        onChange={handleChange}
                        className="addGiftInput"
                        required
                    >
                        <option value="">Select Occasion</option>
                        {occasions.map((occasion) => (
                            <option key={occasion.id} value={occasion.id}>
                                {occasion.name}
                            </option>
                        ))}
                    </select>
                        <button type="button" onClick={() => setShowOccasionModal(true)} className="addNewButton">
                            Add New
                        </button>
                </div>

                    <input type="number" name="price" value={gift.price} onChange={handleChange} placeholder="Price" required className="addGiftInput"/>
                    <input type="text" name="currency" value={gift.currency} onChange={handleChange} placeholder="Currency (GBP)" required className="addGiftInput"/>
                    <textarea name="description" value={gift.description} onChange={handleChange} placeholder="Description" className="addGiftInput"></textarea>
                    <div className="form-group">
                        <label htmlFor="datebought">Date Purchased</label>
                        <input
                            type="date"
                            name="datebought"
                            value={gift.datebought}
                            onChange={handleChange}
                            required
                            className="addGiftInput"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            name="status"
                            value={gift.status}
                            onChange={handleChange}
                            required
                            className="addGiftInput"
                        >
                            <option value="">Select Status</option>
                            <option value="Bought">Bought</option>
                            <option value="Given">Given</option>
                            <option value="Wish List">Wish List</option>
                        </select>
                    </div>
                    <button type="submit">Add Gift</button>
                </form>
        <NewOccasionModal
            show={showOccasionModal}
            handleClose={() => setShowOccasionModal(false)}
            handleSave={handleSaveNewOccasion}
        />

        <NewRecipientModal
            show={showRecipientModal}
            handleClose={() => setShowRecipientModal(false)}
            handleSave={handleSaveNewRecipient}
        />

        <AddGiftSuccessModal 
            show={showSuccessModal} 
            message="Gift added successfully!" 
            onClose={() => setShowSuccessModal(false)} 
        />
        </div>
    );
}

export default AddGift;
