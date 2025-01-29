// src/components/PrivateRoute.jsx
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {

  const token = localStorage.getItem('token');
  // console.log(token)

  if(!token){
    return <Navigate to="/signin"/>
  }
  const {email} = jwtDecode(token);

  console.log(jwtDecode(token))

  if(!email){
    return <Navigate to="/signin"/>
  }


  return children; 
};

export default PrivateRoute;
