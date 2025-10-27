import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPerfumeList from './pages/admin/PerfumeList';
import AdminPerfumeForm from './pages/admin/PerfumeForm';
import AdminPerfumeDetail from "./pages/admin/PerfumeDetail";
import AdminUserList from './pages/admin/UserList';
import BrandList from './pages/admin/BrandList';
import BrandForm from './pages/admin/BrandForm'; // ✅ thêm import cho form brand
import BrandDetail from './pages/admin/BrandDetail';
import ProtectedRoute from './routes/ProtectedRoute';
import UserProfile from './pages/admin/UserProfile';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          {/* --- Public pages --- */}
          <Route path="/" element={<Home />} />
          <Route path="/perfumes/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Profile (user protected) --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* --- Admin: Perfume --- */}
          <Route
            path="/admin/perfumes"
            element={
              <ProtectedRoute adminOnly>
                <AdminPerfumeList />
              </ProtectedRoute>
            }
          />
           <Route
            path="/admin/perfumes/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminPerfumeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/perfumes/add"
            element={
              <ProtectedRoute adminOnly>
                <AdminPerfumeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/perfumes/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <AdminPerfumeForm />
              </ProtectedRoute>
            }
          />

          {/* --- Admin: Users --- */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute adminOnly>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* --- Admin: Brands --- */}
          <Route
            path="/admin/brands"
            element={
              <ProtectedRoute adminOnly>
                <BrandList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brands/add"
            element={
              <ProtectedRoute adminOnly>
                <BrandForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brands/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <BrandForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brands/:id"
            element={
              <ProtectedRoute adminOnly>
                <BrandDetail />
              </ProtectedRoute>
            }
          />


          {/* --- Default redirect --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
