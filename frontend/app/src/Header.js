import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from './slices/userSlice';
import styled from "styled-components";

const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <HeaderContainer>
            <Logo>
                <StyledLink to="/">BestMarketPlace</StyledLink>
            </Logo>

            {user.isAuthenticated && (
                <IconContainer>
                    <StyledLink to="/my-orders">🛍️</StyledLink>
                    <StyledLink to="/cart">🛒</StyledLink>
                    <LogoutButton onClick={handleLogout}>🚪</LogoutButton>
                </IconContainer>
            )}
        </HeaderContainer>
    );
};

// Styled components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f8f8;
  margin: 10px;
`;

const Logo = styled.h1`
  margin-left: 7.5%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }

  &:hover {
    opacity: 0.7; /* Slightly dim the icon on hover */
  }

  &:focus {
    outline: none;
  }

  font-family: 'Gill Sans', 'Verdana', sans-serif;
  font-size: 42px;
  line-height: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;

  -webkit-text-fill-color: transparent; /* Fix for text fill color */
  -webkit-text-stroke: 1px black; /* Fix for text stroke */
`;

const IconContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoutButton = styled.button`
  background: none; /* No background */
  border: none; /* No border */
  cursor: pointer; /* Pointer cursor */
  
  line-height: 14px;
  font-size: 42px;

  &:hover {
    opacity: 0.7;
  }
`;

export default Header;