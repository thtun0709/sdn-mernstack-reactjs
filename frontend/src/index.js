import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';
import 'antd/dist/reset.css';
import AuthProvider from './contexts/AuthProvider'; // ✅ dòng này phải tồn tại

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#c41e3a' } }}>
      <AuthProvider> {/* ✅ phải bọc App bên trong */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  </React.StrictMode>
);
