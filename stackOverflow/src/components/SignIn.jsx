import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false); 
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setLogoutMessage(location.state.message);
      setShowMessage(true); //WELLCOME MESSAGE SHOW KORAR JONNE
      // 3 sec
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [location.state]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5001/auth/signin', 
        { email, password }, 
        { withCredentials: true }
      );
      console.log("Res", response)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Save token in localStorage
        console.log(response);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  
  const handleSignUpNavigation = () => {
    navigate('/signup'); 
  };

  return (
    <div className="flex flex-col items-center h-screen bg-green-100">
      
      <header className="w-full bg-white shadow-md">
        <img src="./assets/logo.png" alt="Logo" className="h-10" /> 
        <h1 className="text-2xl font-bold justify-center text-center">Stack over Flow</h1>
      </header>

      {showMessage && (
        <div className="absolute bottom-10 left-5 p-3 border-2 border-red-500 bg-white rounded shadow-lg text-green-900 text-lg">
        {logoutMessage}
      </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>Don't have an account?</p>
          <button 
            onClick={handleSignUpNavigation} 
            className="text-green-600 font-semibold hover:underline mt-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
