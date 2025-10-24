import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

export default function ProtectedRoute({ children, adminOnly=false }) {
  const { member, loading } = useAuth();
  if (loading) return null;
  if (!member) return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;

  if (adminOnly && member.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
