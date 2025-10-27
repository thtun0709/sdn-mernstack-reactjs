// AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { App } from "antd";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  // 🔐 Login
  const login = async (values) => {
    try {
      console.log("🔄 Đang đăng nhập với:", values.email);
  
      const res = await api.post("/api/auth/login", values, { withCredentials: true });
  
      // ✅ Kiểm tra phản hồi thật
      if (!res.data?.user) {
        throw new Error(res.data?.message || "Đăng nhập thất bại!");
      }
  
      console.log("✅ Đăng nhập thành công:", res.data.user);
      setMember(res.data.user);
      return res.data;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      setMember(null);
  
      // ✅ Hiện thông báo rõ ràng
      message.error(err.response?.data?.message || "Sai mật khẩu hoặc lỗi đăng nhập!");
      throw err;
    }
  };
  

  // 🚪 Logout
  const logout = async () => {
    try {
      console.log("🔄 Đang gọi API logout...");
      await api.get("/api/auth/logout", { withCredentials: true });
      console.log("✅ API logout thành công");
    } catch (err) {
      console.error("❌ Logout error:", err);
    } finally {
      // Luôn xóa member state
      setMember(null);
      console.log("✅ Đã xóa member state");
    }
  };

  // 👤 Lấy thông tin khi load trang
  const fetchProfile = async () => {
    try {
      console.log("🔄 Đang kiểm tra session...");
      const res = await api.get("/api/auth/me", { withCredentials: true });
      console.log("✅ Session hợp lệ:", res.data.user);
      setMember(res.data.user);
    } catch (err) {
      console.log("❌ Không có session hợp lệ:", err.response?.status);
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Clear session hoàn toàn
  const clearSession = async () => {
    try {
      console.log("🔄 Đang clear session hoàn toàn...");
      await api.get("/api/auth/logout", { withCredentials: true });
      console.log("✅ Session đã được clear");
    } catch (err) {
      console.log("⚠️ Lỗi khi clear session:", err.message);
    } finally {
      setMember(null);
      console.log("✅ Member state đã được clear");
    }
  };

  // 🔄 Cập nhật thông tin member
  const updateMember = (updatedUser) => {
    console.log("🔄 Cập nhật member state:", updatedUser);
    setMember(updatedUser);
  };


  useEffect(() => {
    // Kiểm tra session ngay từ đầu thay vì clear session
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ member, login, logout, clearSession, updateMember, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
