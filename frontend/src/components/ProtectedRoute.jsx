import React from 'react';
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem('access_token') //token fetch kia

    return token ? children : <Navigate to={'/login'} /> //  condition base children return kar dea ya login page return kar dea
}

export default ProtectedRoute