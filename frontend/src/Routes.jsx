import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/user/Profile';
import Repositories from './pages/repo/Repositories';
import CreateRepo from './pages/repo/CreateRepo';
import RepoDetail from './pages/repo/RepoDetail';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NotFound from './pages/NotFound';

// Layout & Guards
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { useAuth } from './context/authContext';

import Landing from './pages/Landing';

const ProjectRoutes = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-codevault-background">
        <div className="w-16 h-16 border-4 border-codevault-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (Redirect to dashboard if already logged in) */}
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/landing" element={currentUser ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/forgot-password" element={currentUser ? <Navigate to="/dashboard" /> : <ForgotPassword />} />

      {/* Protected Routes wrapped in Global Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/repos" element={<Repositories />} />
          <Route path="/repo/create" element={<CreateRepo />} />
          <Route path="/repo/:id" element={<RepoDetail />} />
          <Route path="/issues" element={<div className="p-8"><h1 className="text-3xl font-bold">Issues</h1><p className="text-gray-400 mt-2">Phase 5 placeholder</p></div>} />
          <Route path="/starred" element={<div className="p-8"><h1 className="text-3xl font-bold">Starred Repos</h1><p className="text-gray-400 mt-2">Phase 6 placeholder</p></div>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProjectRoutes;
