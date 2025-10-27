import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPenToSquare, FaTrash } from "react-icons/fa6";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../api/axios";
import { App, Modal } from "antd";

export default function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await api.get(`/api/brands/${id}`);
        setBrand(res.data);
      } catch (err) {
        message.error("Không thể tải dữ liệu thương hiệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [id, message]);

  const handleDelete = async () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await api.delete(`/api/brands/${id}`);
          message.success("Đã xóa thương hiệu!");
          navigate("/admin/brands");
        } catch {
          message.error("Xóa thất bại!");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0c0c0c] text-white">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0c0c0c] text-white">
        Không tìm thấy thương hiệu.
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-56 flex-1 flex justify-center mt-20">
        <div className="bg-[#111] text-white p-10 rounded-xl shadow-[0_0_25px_rgba(196,30,58,0.35)] w-[600px]">
          <h1 className="text-center text-[#c41e3a] text-2xl font-semibold mb-8 tracking-wide">
            Chi tiết thương hiệu
          </h1>

          <div className="space-y-4">
            <InfoItem label="Tên thương hiệu" value={brand.name} />
            <InfoItem label="Quốc gia" value={brand.country || "Không rõ"} />
            <InfoItem
              label="Năm thành lập"
              value={brand.foundedYear || "Chưa cập nhật"}
            />
            <InfoItem
              label="Website"
              value={
                brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c41e3a] hover:underline"
                  >
                    {brand.website}
                  </a>
                ) : (
                  "Chưa có website"
                )
              }
            />
            <InfoItem
              label="Mô tả"
              value={brand.description || "Chưa có mô tả"}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <button
              onClick={() => navigate(`/admin/brands/edit/${id}`)}
              className="bg-[#c41e3a] hover:bg-[#a0142e] py-2.5 rounded-md text-white font-medium flex justify-center items-center gap-2 transition"
            >
              <FaPenToSquare /> Sửa
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#700] hover:bg-[#a00] py-2.5 rounded-md text-white font-medium flex justify-center items-center gap-2 transition"
            >
              <FaTrash /> Xóa
            </button>
            <button
              onClick={() => navigate("/admin/brands")}
              className="bg-[#333] hover:bg-[#444] py-2.5 rounded-md text-white font-medium flex justify-center items-center gap-2 transition"
            >
              <FaArrowLeft /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <label className="block text-[#ccc] mb-1 text-sm font-medium">
        {label}
      </label>
      <span className="block bg-[#1a1a1a] rounded-md px-3 py-2 text-white text-sm">
        {value}
      </span>
    </div>
  );
}