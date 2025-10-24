import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { message } from 'antd';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setMember(res.data.user || null);
    } catch (err) {
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post('/api/auth/login', credentials);
      // server sets httpOnly cookie + returns user
      setMember(res.data.user);
      message.success('Login successful');
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed';
      message.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setMember(null);
      message.success('Logged out');
    } catch (err) {
      message.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ member, setMember, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
