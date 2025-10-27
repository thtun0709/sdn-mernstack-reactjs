import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { FaFloppyDisk, FaArrowLeft } from "react-icons/fa6";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button, message } from "antd";
import api from "../../api/axios";

export default function PerfumeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [brands, setBrands] = useState([]);
  const [perfume, setPerfume] = useState({
    perfumeName: "",
    price: "",
    concentration: "",
    gender: "",
    brand: "",
    volume: "",
    targetAudience: "",
    ingredients: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  // 🟢 Lấy danh sách thương hiệu + chi tiết nước hoa (nếu edit)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/api/brands");
        console.log("📦 Brands API response:", res.data);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.brands || [];
        setBrands(data);
      } catch (err) {
        console.error("❌ Brand API error:", err);
        setError("Không tải được danh sách thương hiệu.");
      }
    };

    const fetchPerfume = async () => {
      try {
        const res = await api.get(`/api/perfumes/${id}`);
        const p = res.data.perfume;
        // 🟢 Đảm bảo brand là string (name) khi hiển thị
        setPerfume({
          ...p,
          brand: typeof p.brand === "object" ? p.brand.name : p.brand,
        });
      } catch (err) {
        console.error("❌ Perfume API error:", err);
        setError("Không tải được thông tin nước hoa.");
      }
    };

    fetchBrands();
    if (isEdit) fetchPerfume();
  }, [id, isEdit]);

  // 🟢 Cập nhật input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfume((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Upload ảnh
  const handleUpload = ({ file }) => {
    setPerfume((prev) => ({
      ...prev,
      image: file.originFileObj, // ✅ lấy file thật để gửi qua FormData
    }));
  };

  // 🟢 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submit started:", { isEdit, perfume });
    try {
      const formData = new FormData();
      const perfumeData = {
        ...perfume,
        brand: typeof perfume.brand === "object" ? perfume.brand.name : perfume.brand,
      };
  
      console.log("📦 Perfume data to submit:", perfumeData);
      console.log("🖼️ Image file:", perfume.image);
  
      Object.entries(perfumeData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
          console.log(`📝 Added to FormData: ${key} = ${value}`);
        }
      });
  
      if (isEdit) {
        // 🔁 Cập nhật
        console.log("🔄 Updating perfume with ID:", id);
        const response = await api.put(`/api/perfumes/${id}`, formData, {
          withCredentials: true,
        });
        console.log("✅ Update response:", response.data);
        message.success("Cập nhật nước hoa thành công!");
      } else {
        // 🆕 Thêm mới
        console.log("➕ Creating new perfume");
        const response = await api.post("/api/perfumes", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Create response:", response.data);
        message.success("Thêm nước hoa mới thành công!");
      }
  
      console.log("🏠 Navigating to /admin/perfumes");
      navigate("/admin/perfumes");
    } catch (err) {
      console.error("❌ Lỗi khi lưu nước hoa:", err.response?.data || err.message);
      setError("Không thể lưu dữ liệu. Vui lòng thử lại!");
    }
  };
  

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-56 flex-1 flex justify-center mt-28">
        <div className="bg-[#151515] p-9 rounded-xl w-[700px] shadow-[0_0_20px_rgba(255,0,50,0.2)]">
          <h2 className="text-center text-[#c41e3a] text-2xl font-semibold mb-6 uppercase">
            {isEdit ? "Chỉnh sửa nước hoa" : "Thêm nước hoa mới"}
          </h2>

          {error && <p className="text-[#ff5050] text-center mb-4 font-medium">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* 🧴 Tên nước hoa */}
            <label className="block mb-2 text-[#ccc] font-medium">Tên nước hoa *</label>
            <input
              type="text"
              name="perfumeName"
              value={perfume.perfumeName}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />

            {/* 💸 Giá */}
            <label className="block mb-2 text-[#ccc] font-medium">Giá (VND)</label>
            <input
              type="number"
              name="price"
              value={perfume.price}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />

            <div className="grid grid-cols-2 gap-4">
              {/* 🌫 Nồng độ */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Nồng độ</label>
                <select
                  name="concentration"
                  value={perfume.concentration}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Chọn --</option>
                  <option value="EDP">EDP</option>
                  <option value="EDT">EDT</option>
                  <option value="Extrait">Extrait</option>
                  <option value="Parfum">Parfum</option>
                </select>
              </div>

              {/* 🚻 Giới tính */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Giới tính</label>
                <select
                  name="gender"
                  value={perfume.gender}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* 🏷 Thương hiệu */}
            <label className="block mb-2 text-[#ccc] font-medium">Thương hiệu</label>
            <select
              name="brand"
              value={perfume.brand}
              onChange={(e) =>
                setPerfume({
                  ...perfume,
                  brand: e.target.value, // ✅ Lưu brandName
                })
              }
              disabled={isEdit}
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b._id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              {/* 📦 Dung tích */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Dung tích (ml)</label>
                <input
                  type="number"
                  name="volume"
                  value={perfume.volume}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                />
              </div>

              {/* 👤 Đối tượng */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Đối tượng</label>
                <select
                  name="targetAudience"
                  value={perfume.targetAudience}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Chọn --</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* 🌿 Thành phần */}
            <label className="block mb-2 text-[#ccc] font-medium">Thành phần</label>
            <textarea
              name="ingredients"
              rows="3"
              value={perfume.ingredients}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#222] text-white border-none outline-none resize-y focus:ring-2 focus:ring-[#c41e3a] mb-4"
            />

            {/* 📖 Mô tả */}
            <label className="block mb-2 text-[#ccc] font-medium">Mô tả</label>
            <textarea
              name="description"
              rows="4"
              value={perfume.description}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#222] text-white border-none outline-none resize-y focus:ring-2 focus:ring-[#c41e3a] mb-4"
            />

            {/* 🖼 Ảnh */}
            <label className="block mb-2 text-[#ccc] font-medium">Hình ảnh nước hoa</label>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleUpload}
              listType="picture"
              className="mb-4"
            >
              <Button icon={<UploadOutlined />} className="bg-[#222] text-white border-none">
                Chọn ảnh
              </Button>
            </Upload>

            {/* ⚙️ Nút hành động */}
            <div className="grid grid-cols-2 gap-5 mt-6">
              <button
                type="submit"
                className="bg-[#c41e3a] hover:bg-[#a0142e] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
              >
                <FaFloppyDisk /> {isEdit ? "Cập nhật" : "Lưu"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/perfumes")}
                className="bg-[#333] hover:bg-[#444] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
              >
                <FaArrowLeft /> Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
