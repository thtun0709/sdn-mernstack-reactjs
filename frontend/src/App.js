import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PerfumeDetail from './pages/PerfumeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPerfumeList from './pages/admin/PerfumeList';
import AdminPerfumeForm from './pages/admin/PerfumeForm';
import AdminUserList from './pages/admin/UserList';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfumes/:id" element={<PerfumeDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          <Route path="/admin/perfumes" element={
            <ProtectedRoute adminOnly><AdminPerfumeList /></ProtectedRoute>
          } />
          <Route path="/admin/perfumes/add" element={
            <ProtectedRoute adminOnly><AdminPerfumeForm /></ProtectedRoute>
          } />
          <Route path="/admin/perfumes/edit/:id" element={
            <ProtectedRoute adminOnly><AdminPerfumeForm /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><AdminUserList /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
