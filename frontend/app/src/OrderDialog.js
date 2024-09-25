import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 1; /* Ensure it is above other elements */
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column; /* Arrange elements in a column */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 300px;
  z-index: 2; /* Ensure the dialog is above the overlay */
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: calc(100% - 16px); /* Account for padding */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  display: flex; /* Use flexbox for buttons */
  justify-content: flex-end; /* Align buttons to the right */
`;

const Button = styled.button`
  margin-left: 10px; /* Space between buttons */
  padding: 8px; /* Added padding for better usability */
`;

const OrderDialog = ({ open, onClose, onSubmit }) => {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ deliveryAddress, deliveryDate });
        onClose(); // Close the dialog after submission
    };

    if (!open) return null; // If the dialog is not open, render nothing

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Overlay onClick={onClose} /> {/* Overlay background */}
            <DialogContainer>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>Delivery address:</label>
                        <Input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Delivery date:</label>
                        <Input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            required
                            min={today} // Set minimum date to today
                        />
                    </FormGroup>
                    <ButtonContainer>
                        <Button type="submit">Create order</Button>
                        <Button type="button" onClick={onClose}>Cancel</Button>
                    </ButtonContainer>
                </form>
            </DialogContainer>
        </>
    );
};

export default OrderDialog;