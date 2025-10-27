// src/pages/Admin/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function UserProfile() {
  const { id } = useParams(); // /admin/users/:id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/profile/${id}`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin người dùng:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
        Đang tải thông tin người dùng...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "40px" }}>
        Không tìm thấy người dùng.
      </div>
    );
  }

  const genderDisplay = (() => {
    if (typeof user.gender === "boolean") {
      return user.gender ? "Male" : "Female";
    }
    if (!user.gender || user.gender === "null") {
      return "Không rõ";
    }
    return user.gender;
  })();

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar member={{ name: "Admin" }} />

      <div className="profile-container">
        <h1>User Profile</h1>

        <div className="info-item">
          <label>Name</label>
          <span>{user.name}</span>
        </div>

        <div className="info-item">
          <label>Email</label>
          <span>{user.email}</span>
        </div>

        <div className="info-item">
          <label>Giới tính</label>
          <span className="gender">
            {genderDisplay === "Male" ? (
              <>
                <i className="fa-solid fa-mars" style={{ color: "#1e90ff" }}></i> {genderDisplay}
              </>
            ) : genderDisplay === "Female" ? (
              <>
                <i className="fa-solid fa-venus" style={{ color: "#ff69b4" }}></i> {genderDisplay}
              </>
            ) : (
              <>
                <i className="fa-solid fa-venus-mars" style={{ color: "#c41e3a" }}></i> {genderDisplay}
              </>
            )}
          </span>
        </div>

        <div className="info-item">
          <label>YOB</label>
          <span>{user.YOB}</span>
        </div>

        <div className="info-item">
          <label>Role</label>
          <span>{user.role}</span>
        </div>

        <div className="info-item">
          <label>Status</label>
          <span className={`status ${user.isActive ? "active" : "locked"}`}>
            {user.isActive ? "Active" : "Locked"}
          </span>
        </div>

        <Link to="/admin/users" className="back-btn">
          <i className="fa-solid fa-arrow-left"></i> Back to user list
        </Link>

        <style jsx="true">{`
          body {
            background: #0c0c0c;
            color: #fff;
            font-family: 'Poppins', sans-serif;
          }

          .profile-container {
            flex: 1;
            max-width: 600px;
            background: #151515;
            border-radius: 12px;
            padding: 40px 50px;
            box-shadow: 0 0 25px rgba(196, 30, 58, 0.4);
            text-align: center;
            margin: 60px auto;
          }

          h1 {
            color: #c41e3a;
            margin-bottom: 35px;
            letter-spacing: 1px;
            font-size : 30px;
          }

          .info-item {
            margin-bottom: 18px;
            font-size: 16px;
          }

          .info-item label {
            display: block;
            color: #bbb;
            font-weight: 600;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .info-item span {
            color: #fff;
            font-size: 17px;
          }

          .status.active {
            color: #28a745;
            font-weight: 600;
          }

          .status.locked {
            color: #dc3545;
            font-weight: 600;
          }

          .back-btn {
            display: inline-block;
            margin-top: 30px;
            background: #333;
            color: #fff;
            padding: 10px 22px;
            border-radius: 6px;
            text-decoration: none;
            transition: 0.3s;
            font-weight: 500;
          }

          .back-btn:hover {
            background: #444;
          }

          @media (max-width: 600px) {
            .profile-container {
              padding: 30px 20px;
            }
            .info-item {
              font-size: 15px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
