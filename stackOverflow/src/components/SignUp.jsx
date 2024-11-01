import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [username, setUsername] = useState('');  // New state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Include username in the request
    axios.post('http://localhost:5000/auth/signup', { username, email, password })
      .then(response => {
        // On successful sign-up, navigate to the sign-in page
        navigate('/signin');
      })
      .catch(error => alert('Error signing up'));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <button 
            onClick={() => navigate('/signin')} 
            className="text-blue-600 font-semibold hover:underline mt-2"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
