import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Login from './login';
import Register from './register';
import Home from './home';
import EventDetails from './event-details';
import GeneralInfo from './general-info';
import Profile from './profile';
import Schedule from './schedule';
import Speakers from './speakers';
import Sponsors from './sponsors';
import Venue from './venue';

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const { loadStoredAuth, isLoading } = useAuthStore();
  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) return <div className="center">Carregando...</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/event-details/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
      <Route path="/general-info/:eventId" element={<ProtectedRoute><GeneralInfo /></ProtectedRoute>} />
      <Route path="/profile/:eventId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/schedule/:eventId" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/speakers/:eventId" element={<ProtectedRoute><Speakers /></ProtectedRoute>} />
      <Route path="/sponsors/:eventId" element={<ProtectedRoute><Sponsors /></ProtectedRoute>} />
      <Route path="/venue/:eventId" element={<ProtectedRoute><Venue /></ProtectedRoute>} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}


