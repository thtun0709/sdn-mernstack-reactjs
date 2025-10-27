import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd"; // ✅ thêm App của Ant Design
import App from "./App";
import "./index.css";
import "antd/dist/reset.css";
import { AuthProvider } from "./contexts/AuthProvider"; // ✅ vẫn giữ nguyên

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#c41e3a" } }}>
      {/* ✅ Bọc toàn bộ trong Ant Design App để message, notification, modal hoạt động đúng */}
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
