import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ member }) {
  const location = useLocation();

  const menuItems = [
    { key: "/admin/perfumes", label: "📦 Manage Perfumes" },
    { key: "/admin/users", label: "👥 Manage Users" },
    { key: "/admin/brands", label: "🏷️ Manage Brands" },
  ];

  return (
    <aside className="admin-dashboard">
      <h2 className="logo">
        <Link to="/admin/perfumes" style={{ color: "#fff", textDecoration: "none" }}>
          Admin Panel
        </Link>
        <span>
          Hello, <b>{member?.name || "Admin"}</b>
        </span>
      </h2>

      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.key}>
            <Link
              to={item.key}
              className={location.pathname === item.key ? "active" : ""}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Style nội tuyến giống EJS gốc */}
      <style jsx="true">{`
        .admin-dashboard {
          margin-top:80px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 230px;
          background: #151515;
          border-right: 1px solid #222;
          padding: 25px 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .admin-dashboard .logo {
          color: #fff;
          text-align: center;
          font-size: 20px;
          margin-top: 50px; !important
        }

        .admin-dashboard .logo span {
          display: block;
          margin-top: 8px;
          font-size: 14px;
          color: #aaa;
        }

        .admin-dashboard .menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .admin-dashboard .menu a {
          color: #ccc;
          text-decoration: none;
          font-size: 15px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: 0.3s;
          display: block;
        }

        .admin-dashboard .menu a:hover,
        .admin-dashboard .menu a.active {
          background: #c41e3a;
          color: #fff;
        }
      `}</style>
    </aside>
  );
}
