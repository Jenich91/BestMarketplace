import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ProtectedRoute from "./ProtectedRoute";
import MainPage from "./MainPage";
import CartPage from "./CartPage";
import ProductDetails from "./ProductDetails";
import MyOrdersPage from "./MyOrdersPage";

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products/:productId" element={<ProductDetails />} />

            {/* Protected routes for authenticated users */}
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-orders"
                element={
                    <ProtectedRoute>
                        <MyOrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* Redirect to home if route not found */}
            <Route
                path="*"
                element={<Navigate to="/" />}
            />
        </Routes>
    );
}

export default App;
