import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomePage from './components/Home';
// import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <div>
      <Routes>
      <Route path='/' element={<SignIn />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/home' element={<PrivateRoute><HomePage /></PrivateRoute>}></Route>
      </Routes>
     
    </div>
  );
}

export default App;
