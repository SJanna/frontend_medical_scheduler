import MyCalendar from './components/MyCalendar';
import Login from './components/Login';
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import AppointmentForm from './components/AppointmentForm'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from './components/NotificationContext';


const App = () => {
  // Verificar si el token existe en el almacenamiento local
  const token = localStorage.getItem('token');

  return (

    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={token ? <Navbar /> : <Navigate to="/login" replace />}
          >
            <Route
              exact
              path="/profile"
              element={token ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
              exact
              path="/"
              element={token ? <MyCalendar /> : <Navigate to="/" replace />}
            />
          </Route>
          <Route exact path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>

  );
}

export default App;