// import './App.css';
// import './index.css';
import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import ReportForm from './pages/ReportForm/ReportForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReportStatusPage from './pages/Status/ReportStatusPage'
import NotificationPage from './pages/Notification/Notification';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp/SignUp';


function App() {
  return (

    <div >
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/status/:id" element={<ReportStatusPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/user-login" element={<Login/>} />
          <Route path="/user-signup" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
