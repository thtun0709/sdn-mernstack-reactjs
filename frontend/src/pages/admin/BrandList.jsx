import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";
import { FaTrash, FaEye, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { message } from "antd";

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data || []);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onDelete = async (id, brandName) => {
    console.log('🗑️ Delete clicked for:', id, brandName);
    
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"?`);
    
    if (!confirmed) {
      console.log('❌ User cancelled delete');
      return;
    }
    
    console.log('✅ User confirmed delete');
    try {
      console.log('🔄 Sending DELETE request to:', `/api/brands/${id}`);
      const res = await api.delete(`/api/brands/${id}`);
      console.log('📦 Response:', res.data);
      
      // Kiểm tra response để hiển thị thông báo phù hợp
      if (res.data.canDelete) {
        message.success(res.data.message || "Xóa thương hiệu thành công!");
        fetchBrands();
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      // Xử lý lỗi từ backend
      if (error.response && error.response.status === 400) {
        const { message: msg, perfumeCount } = error.response.data;
        console.log('⚠️ Cannot delete - has perfumes:', perfumeCount);
        alert(msg || `Không thể xóa thương hiệu này vì có ${perfumeCount} nước hoa đang sử dụng`);
      } else {
        message.error("Có lỗi xảy ra khi xóa thương hiệu. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div className="admin-content">
        <h1 style={{ color: "white" }}>
          Manage <span style={{ color: "#c41e3a" }}>Brands</span>
        </h1>

        <div className="top-bar">
          <Link to="/admin/brands/add" className="add-btn">
            <FaPlus style={{ marginRight: "6px" }} />
            Add New Brand
          </Link>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div className="perfume-list">
            <div className="list-header">
              <span>Name</span>
              <span>Country</span>
              <span>Founded</span>
              <span>Website</span>
              <span>Description</span>
              <span>Action</span>
            </div>

            {brands.map((b) => (
              <div key={b._id} className="perfume-row">
                <div>{b.name || "—"}</div>
                <div>{b.country || "—"}</div>
                <div>{b.foundedYear || "—"}</div>
                <div>
                  {b.website ? (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#c41e3a", textDecoration: "none" }}
                    >
                      {b.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  {b.description?.length > 60
                    ? b.description.slice(0, 60) + "..."
                    : b.description || "—"}
                </div>
                <div className="perfume-actions">
                  <Link
                    to={`/admin/brands/${b._id}`}
                    className="btn-icon"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/brands/edit/${b._id}`}
                    className="btn-icon btn-edit"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => onDelete(b._id, b.name)}
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
            grid-template-columns: 1.2fr 1fr 1fr 1.5fr 2fr 0.8fr;
            background: #202020;
            padding: 12px 15px;
            border-bottom: 2px solid #c41e3a;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .perfume-row {
            display: grid;
            grid-template-columns: 1.2fr 1fr 1fr 1.5fr 2fr 0.8fr;
            align-items: center;
            background: #151515;
            border-bottom: 1px solid #333;
            padding: 10px 15px;
            transition: background 0.3s ease;
          }

          .perfume-row:hover {
            background: #1e1e1e;
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
