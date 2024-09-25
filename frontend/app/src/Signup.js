import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Signup = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        setError(''); // Reset error if passwords match

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();
            alert(data.message);
            console.log(data);

            if (response.ok) {
                navigate("/login"); // Navigate to login on successful signup
            } else {
                setError(data.message || 'Signup failed. Please try again.'); // Handle errors
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <Header />
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Label>Login</Label>
                    <Input type="text" value={login} onChange={(e) => setLogin(e.target.value)} required />
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Label>Repeat Password</Label>
                    <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                    {error && <ErrorMessage>{error}</ErrorMessage>} {/* Display error message */}
                    <Button type="submit">Sign up</Button>
                    <p>Already have an account? <a href="/login">Sign in</a></p>
                </Form>
            </Container>
        </div>
    );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px; /* Increased padding for better usability */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

export default Signup;