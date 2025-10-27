import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Popconfirm, message } from "antd";
import { FaArrowLeft, FaPenToSquare, FaTrash } from "react-icons/fa6";
import api, { assetUrl } from "../../api/axios";
import AdminSidebar from "../../components/AdminSidebar";

export default function PerfumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch chi tiết nước hoa
  useEffect(() => {
    const fetchPerfume = async () => {
      try {
        const res = await api.get(`/api/perfumes/${id}`);
        console.log("📦 Perfume detail response:", res.data);
        // Backend trả về { perfume, comments, avgRating }
        setPerfume(res.data.perfume || res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy nước hoa:", err);
        message.error("Không tải được chi tiết nước hoa!");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfume();
  }, [id]);

  // 🗑️ Xóa nước hoa
  const handleDelete = async () => {
    try {
      await api.delete(`/api/perfumes/${id}`);
      message.success("Đã xóa nước hoa!");
      navigate("/admin/perfumes");
    } catch (err) {
      console.error("❌ Lỗi khi xóa nước hoa:", err);
      message.error("Không thể xóa nước hoa!");
    }
  };

  if (loading)
    return (
      <div className="text-center text-white mt-10 text-lg">
        Đang tải chi tiết nước hoa...
      </div>
    );

  if (!perfume)
    return (
      <div className="text-center text-white mt-10 text-lg">
        Không tìm thấy nước hoa.
      </div>
    );

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      
      <div className="flex-1 min-h-screen bg-[#0c0c0c] text-white py-12 px-6" style={{ marginLeft: "230px" }}>
        <div className="max-w-5xl mx-auto bg-[#151515] p-8 rounded-xl shadow-lg border border-[#222]">
          <div className="flex flex-col md:flex-row gap-10">
            {/* 🖼️ Ảnh nước hoa */}
            <img
              src={perfume.image ? assetUrl(perfume.image) : assetUrl("/images/default_perfume.jpg")}
              alt={perfume.perfumeName || perfume.name}
              className="w-[350px] h-[400px] object-cover rounded-lg border border-[#333] shadow-md"
              onError={(e) => e.target.src = assetUrl("/images/default_perfume.jpg")}
            />

            {/* 🧾 Thông tin */}
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-[#c41e3a] mb-3">
                {perfume.perfumeName || perfume.name}
              </h2>

              <p className="text-gray-300 mb-1">
                <strong className="text-white">Brand:</strong>{" "}
                {perfume.brand?.brandName ||
                  perfume.brand?.name ||
                  perfume.brand ||
                  "—"}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-white">URI:</strong>{" "}
                {perfume.uri || "—"}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-white">Concentration:</strong>{" "}
                {perfume.concentration || "—"}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-white">Volume:</strong>{" "}
                {perfume.volume ? `${perfume.volume} ml` : "—"}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-white">Target:</strong>{" "}
                {perfume.targetAudience || perfume.gender || "—"}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-white">Description:</strong>{" "}
                {perfume.description || "No description"}
              </p>
              {perfume.ingredients && (
                <p className="text-gray-300 mb-1">
                  <strong className="text-white">Ingredients:</strong>{" "}
                  {perfume.ingredients}
                </p>
              )}

              <p className="text-[#c41e3a] font-semibold text-xl mt-5">
                {perfume.price
                  ? `${perfume.price.toLocaleString()} VND`
                  : "—"}
              </p>

              {/* ⚙️ Hành động */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Button
                  type="primary"
                  className="bg-[#c41e3a] hover:bg-[#a0142e]"
                  onClick={() => navigate(`/admin/perfumes/edit/${perfume._id}`)}
                >
                  <FaPenToSquare className="mr-2" /> Edit
                </Button>

                <Popconfirm
                  title="Xóa nước hoa?"
                  description="Bạn có chắc chắn muốn xóa nước hoa này?"
                  onConfirm={handleDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger className="bg-[#700] hover:bg-[#a0142e]">
                    <FaTrash className="mr-2" /> Delete
                  </Button>
                </Popconfirm>

                <Button
                  className="bg-[#333] text-white hover:bg-[#222]"
                  onClick={() => navigate("/admin/perfumes")}
                >
                  <FaArrowLeft className="mr-2" /> Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
