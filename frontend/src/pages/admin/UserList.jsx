import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import { FaTrash, FaUser, FaLock, FaUnlock} from "react-icons/fa";
import { Link } from "react-router-dom";


export default function UserList() {
  const [users, setUsers] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true, // ⚠️ cần thiết để gửi session cookie
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách user:", err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  const openPopup = (user) => {
    setSelectedUser(user);
    setPopupVisible(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedUser(null);
    document.body.style.overflow = "";
  };

  const confirmToggle = async () => {
    if (!selectedUser) return;
    await api.put(`/api/users/toggle/${selectedUser._id}`);
    closePopup();
    fetchUsers();
  };

  const onDelete = async (id) => {
    if (window.confirm("Xóa người dùng này?")) {
      await api.delete(`/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar member={{ name: "Admin" }} />

      <div className="admin-content">
        <h1 >
          Manage <span style={{ color: "#c41e3a" }}>Users</span>
        </h1>

        {loading ? (
          <p style={{ textAlign: "center" }}>Đang tải...</p>
        ) : (
          <div className="user-list">
            <div className="list-header">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span>Action</span>
            </div>

            {users.map((u) => (
              <div key={u._id} className="user-row">
                <div>{u.name}</div>
                <div>{u.email}</div>
                <div>{u.role}</div>
                
                <div className="user-actions">
                <Link
  to={`/admin/users/${u._id}`}
  className="btn-icon"
  style={{ background: "#444" }}
  title="Xem hồ sơ"
>
  <FaUser />
</Link>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(u._id)}
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popup xác nhận */}
        {popupVisible && selectedUser && (
          <div
            className="popup show"
            onClick={(e) => e.target === e.currentTarget && closePopup()}
          >
            <div className="popup-content">
              <button className="popup-close" onClick={closePopup}>
                &times;
              </button>
              <h3>
                {selectedUser.isActive
                  ? "Are you sure you want to LOCK this account?"
                  : "Are you sure you want to UNLOCK this account?"}
              </h3>
              <div className="popup-text">
                {selectedUser.isActive
                  ? "The user will not be able to login after being locked."
                  : "The user will be able to login again after being unlocked."}
              </div>
              <div className="popup-buttons">
                <button className="popup-btn confirm" onClick={confirmToggle}>
                  Confirm
                </button>
                <button className="popup-btn cancel" onClick={closePopup}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Style tổng thể */}
        <style jsx="true">{`
          body {
            background-color: #0c0c0c;
            color: #fff;
            font-family: "Poppins", sans-serif;
            margin: 0;
            padding: 0;
          }
          h1 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 30px;
}

          /* ✅ Sửa layout bị che sidebar */
          .admin-content {
            flex: 1;
            width: calc(100% - 230px);
            margin-left: 230px;
            padding: 40px 20px;
            color: #fff;
            background-color: #0c0c0c;
            min-height: 100vh;
          }

          h1 {
            text-align: center;
            margin-bottom: 20px;
            font-weight: 600;
            letter-spacing: 1px;
          }

          .user-list {
            width: 100%;
            margin-top: 30px;
            color: #fff;
          }

          .list-header {
            display: grid;
             grid-template-columns: 1.2fr 1.2fr 1.2fr 0.55fr;
            background: #202020;
            padding: 12px 15px;
            border-bottom: 2px solid #c41e3a;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .user-row {
            display: grid;
            grid-template-columns: 1.2fr 1.5fr 1fr 1fr;
            align-items: center;
            background: #151515;
            border-bottom: 1px solid #333;
            padding: 10px 15px;
            transition: background 0.3s ease;
          }

          .user-row:hover {
            background: #1e1e1e;
          }

          .status {
            color: #ccc;
            font-size: 14px;
          }

          .status.active {
            color: #28a745;
            font-weight: 600;
          }

          .status.locked {
            color: #dc3545;
            font-weight: 600;
          }

          .user-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
          }

          .btn-icon {
            color: #fff;
            background: #c41e3a;
            padding: 8px 10px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            transition: 0.3s;
            font-size: 15px;
          }

          .btn-icon:hover {
            background: #a0142e;
          }

          .btn-toggle {
            background: #1a5f7a;
          }

          .btn-toggle:hover {
            background: #207398;
          }

          .btn-delete {
            background: #700;
          }

          .btn-delete:hover {
            background: #a00;
          }

          .popup {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.55);
            z-index: 9999;
            padding: 20px;
            backdrop-filter: blur(2px);
          }

          .popup-content {
            position: relative;
            width: 100%;
            max-width: 420px;
            background: #151515;
            border-radius: 12px;
            padding: 22px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
            text-align: center;
            animation: popup-in 160ms ease-out;
          }

          @keyframes popup-in {
            from {
              transform: translateY(8px) scale(0.99);
              opacity: 0;
            }
            to {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }

          .popup-content h3 {
            margin: 0 0 10px 0;
            color: #fff;
            font-size: 18px;
            line-height: 1.3;
          }

          .popup-text {
            color: #ccc;
            font-size: 14px;
            margin-bottom: 14px;
          }

          .popup-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 12px;
          }

          .popup-btn {
            padding: 9px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
          }

          .popup-btn.confirm {
            background: #c41e3a;
            color: #fff;
          }

          .popup-btn.cancel {
            background: #303030;
            color: #fff;
          }

          .popup-close {
            position: absolute;
            top: 18px;
            right: 20px;
            background: transparent;
            color: #ddd;
            border: none;
            font-size: 18px;
            cursor: pointer;
          }

          @media (max-width: 480px) {
            .list-header,
            .user-row {
              grid-template-columns: 1fr 1fr 1fr 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
