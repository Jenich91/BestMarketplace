import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from "./slices/userSlice";

const ProtectedRoute = ({ children }) => {
    const user = useSelector(selectUser);

    if (!user.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;