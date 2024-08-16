
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome';
import LoginRegister from './Components/LoginRegister';
import VerifyEmail from './Components/VerifyEmail';
import ForgotPassword from './Components/ForgotPassword';
import UpdatePassword from './Components/UpdatePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/register" element={<LoginRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/update-password" element={<UpdatePassword />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;
