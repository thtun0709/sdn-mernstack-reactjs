import React, { useEffect, useState } from "react";
import api, { assetUrl } from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import { FaTrash, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function PerfumeList() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/perfumes");
      console.log("📦 Fetching perfumes data...");
      const perfumesData = res.data.perfumes || res.data || [];
      setPerfumes(perfumesData);
    } catch (error) {
      console.error("❌ Lỗi khi fetch perfumes:", error);
      setPerfumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Chỉ refresh khi quay lại từ edit form
  useEffect(() => {
    if (location.pathname === '/admin/perfumes') {
      fetchPerfumes();
    }
  }, [location.pathname]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return assetUrl("/images/default_perfume.jpg");
    // Đảm bảo đường dẫn ảnh đúng format
    if (!imagePath.startsWith("/uploads/")) {
      imagePath = `/uploads/perfumes/${imagePath}`;
    }
    return assetUrl(imagePath);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this perfume?")) {
      try {
        await api.delete(`/api/perfumes/${id}`);
        console.log("✅ Perfume deleted successfully");
        fetchPerfumes();
      } catch (error) {
        console.error("❌ Error deleting perfume:", error);
        alert("Không thể xóa nước hoa. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="admin-content">
        <h1 style={{ color: "white" }}>
          Manage <span style={{ color: "#c41e3a" }}>Perfume</span>
        </h1>

        <div className="top-bar">
          <Link to="/admin/perfumes/add" className="add-btn">
            <FaPlus style={{ marginRight: "6px" }} />
            Add New Perfume
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div className="perfume-list">
            <div className="list-header">
              <span>Image</span>
              <span>Name</span>
              <span>Brand</span>
              <span>Price</span>
              <span>Gender</span>
              <span>Action</span>
            </div>

            {perfumes.map((p) => (
              <div key={p._id} className="perfume-row">
                <div className="perfume-img-container">
                  <img
                    src={getImageUrl(p.image)}
                    alt={p.perfumeName || p.name || "Perfume"}
                    loading="lazy"
                    className="perfume-img"
                    onError={(e) =>
                      (e.target.src = assetUrl("/images/default_perfume.jpg"))
                    }
                  />
                </div>
                <div>{p.perfumeName || "—"}</div>
                <div>{p.brand || "—"}</div>
                <div style={{ color: "#c41e3a" }}>
                  {p.price?.toLocaleString() || 0} VND
                </div>
                <div
                  style={{
                    color:
                      p.gender === "Nam"
                        ? "#3fa7ff"
                        : p.gender === "Nữ"
                        ? "#ff69b4"
                        : "#b28cff",
                    fontWeight: "600",
                  }}
                >
                  {p.gender || "—"}
                </div>
                <div className="perfume-actions">
                  <Link
                    to={`/perfumes/${p._id}`}
                    className="btn-icon"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/perfumes/edit/${p._id}`}
                    className="btn-icon btn-edit"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(p._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <style jsx="true">{`
          body {
            background-color: #0c0c0c;
            color: #fff;
            font-family: "Poppins", sans-serif;
          }

          .admin-content {
            flex: 1;
            width: calc(100% - 230px);
            margin-left: 230px;
            padding: 40px 20px;
            background-color: #0c0c0c;
            min-height: 100vh;
          }

          h1 {
            text-align: center;
            margin-bottom: 30px;
            font-weight: 600;
            letter-spacing: 1px;
            font-size: 32px;
          }

          .top-bar {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
          }

          .add-btn {
            background: #c41e3a;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            transition: 0.3s;
          }

          .add-btn:hover {
            background: #a0142e;
          }

          .perfume-list {
            width: 100%;
            margin-top: 10px;
            color: #fff;
          }

          .list-header {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1.2fr 1fr 1fr 1fr;
            background: #202020;
            padding: 12px 15px;
            border-bottom: 2px solid #c41e3a;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .perfume-row {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1.2fr 1fr 1fr 1fr;
            align-items: center;
            background: #151515;
            border-bottom: 1px solid #333;
            padding: 10px 15px;
            transition: background 0.3s ease;
          }

          .perfume-row:hover {
            background: #1e1e1e;
          }

          .perfume-img-container {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #222;
            border-radius: 10px;
            overflow: hidden;
            padding: 5px;
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
            flex-shrink: 0;
          }

          .perfume-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 6px;
            transition: transform 0.3s ease, opacity 0.2s ease;
          }

          .perfume-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
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
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-icon:hover {
            background: #a0142e;
          }

          .btn-edit {
            background: #1a5f7a;
          }

          .btn-edit:hover {
            background: #207398;
          }

          .btn-delete {
            background: #700;
          }

          .btn-delete:hover {
            background: #a00;
          }

          @media (max-width: 480px) {
            .list-header,
            .perfume-row {
              grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
