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
    uri: "",
    ingredients: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const isEdit = Boolean(id);

  // Fetch brands list + perfume details (if edit mode)
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
        setError("Failed to load brands list.");
      }
    };

    const fetchPerfume = async () => {
      try {
        const res = await api.get(`/api/perfumes/${id}`);
        const p = res.data.perfume;
        // Ensure brand is string (name) when displaying
        setPerfume({
          ...p,
          brand: typeof p.brand === "object" ? p.brand.name : p.brand,
        });
      } catch (err) {
        console.error("❌ Perfume API error:", err);
        setError("Failed to load perfume information.");
      }
    };

    fetchBrands();
    if (isEdit) fetchPerfume();
  }, [id, isEdit]);

  // Update input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfume((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image
  const handleUpload = ({ file }) => {
    setPerfume((prev) => ({
      ...prev,
      image: file.originFileObj || file,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submit started:", { isEdit, perfume });
    try {
      const formData = new FormData();
      
      // Lấy brand name
      const brandName = typeof perfume.brand === "object" ? perfume.brand.name : perfume.brand;
  
      console.log("📦 Perfume data to submit:", perfume);
      console.log("🖼️ Image file:", perfume.image);
  
      // Add fields to FormData
      formData.append("perfumeName", perfume.perfumeName || "");
      formData.append("price", perfume.price || "");
      formData.append("concentration", perfume.concentration || "");
      formData.append("gender", perfume.gender || "");
      formData.append("brand", brandName || "");
      formData.append("volume", perfume.volume || "");
      formData.append("targetAudience", perfume.targetAudience || "");
      formData.append("uri", perfume.uri || "");
      formData.append("ingredients", perfume.ingredients || "");
      formData.append("description", perfume.description || "");
      
      // Add image if exists
      if (perfume.image && perfume.image instanceof File) {
        formData.append("image", perfume.image);
        console.log("📝 Added image to FormData:", perfume.image.name);
      }
  
      if (isEdit) {
        // Update
        console.log("🔄 Updating perfume with ID:", id);
        const response = await api.put(`/api/perfumes/${id}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Update response:", response.data);
        message.success("Perfume updated successfully!");
      } else {
        // Add new
        console.log("➕ Creating new perfume");
        const response = await api.post("/api/perfumes", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("✅ Create response:", response.data);
        message.success("New perfume added successfully!");
      }
  
      console.log("🏠 Navigating to /admin/perfumes");
      navigate("/admin/perfumes");
    } catch (err) {
      console.error("❌ Lỗi khi lưu nước hoa:", err.response?.data || err.message);
      setError("Failed to save data. Please try again!");
    }
  };
  

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-56 flex-1 flex justify-center mt-28">
        <div className="bg-[#151515] p-9 rounded-xl w-[700px] shadow-[0_0_20px_rgba(255,0,50,0.2)]">
          <h2 className="text-center text-[#c41e3a] text-2xl font-semibold mb-6 uppercase">
            {isEdit ? "Edit Perfume" : "Add New Perfume"}
          </h2>

          {error && <p className="text-[#ff5050] text-center mb-4 font-medium">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Perfume Name */}
            <label className="block mb-2 text-[#ccc] font-medium">Perfume Name *</label>
            <input
              type="text"
              name="perfumeName"
              value={perfume.perfumeName}
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />

            {/* Price */}
            <label className="block mb-2 text-[#ccc] font-medium">Price (VND)</label>
            <input
              type="number"
              name="price"
              value={perfume.price}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Concentration */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Concentration</label>
                <select
                  name="concentration"
                  value={perfume.concentration}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Select --</option>
                  <option value="EDP">EDP</option>
                  <option value="EDT">EDT</option>
                  <option value="Extrait">Extrait</option>
                  <option value="Parfum">Parfum</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Gender</label>
                <select
                  name="gender"
                  value={perfume.gender}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Select --</option>
                  <option value="Nam">Male</option>
                  <option value="Nữ">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* Brand */}
            <label className="block mb-2 text-[#ccc] font-medium">Brand</label>
            <select
              name="brand"
              value={perfume.brand}
              onChange={(e) =>
                setPerfume({
                  ...perfume,
                  brand: e.target.value,
                })
              }
              disabled={isEdit}
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            >
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b._id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              {/* Volume */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Volume (ml)</label>
                <input
                  type="number"
                  name="volume"
                  value={perfume.volume}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block mb-2 text-[#ccc] font-medium">Target Audience</label>
                <select
                  name="targetAudience"
                  value={perfume.targetAudience}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                >
                  <option value="">-- Select --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* URL */}
            <label className="block mb-2 text-[#ccc] font-medium">URL (Product Link)</label>
            <input
              type="text"
              name="uri"
              value={perfume.uri}
              onChange={handleChange}
              placeholder="https://example.com/product"
              className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
            />

            {/* Ingredients */}
            <label className="block mb-2 text-[#ccc] font-medium">Ingredients</label>
            <textarea
              name="ingredients"
              rows="3"
              value={perfume.ingredients}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#222] text-white border-none outline-none resize-y focus:ring-2 focus:ring-[#c41e3a] mb-4"
            />

            {/* Description */}
            <label className="block mb-2 text-[#ccc] font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              value={perfume.description}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-[#222] text-white border-none outline-none resize-y focus:ring-2 focus:ring-[#c41e3a] mb-4"
            />

            {/* Image */}
            <label className="block mb-2 text-[#ccc] font-medium">Perfume Image</label>
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleUpload}
              listType="picture"
              className="mb-4"
            >
              <Button icon={<UploadOutlined />} className="bg-[#222] text-white border-none">
                Select Image
              </Button>
            </Upload>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-5 mt-6">
              <button
                type="submit"
                className="bg-[#c41e3a] hover:bg-[#a0142e] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
              >
                <FaFloppyDisk /> {isEdit ? "Update" : "Save"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/perfumes")}
                className="bg-[#333] hover:bg-[#444] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
              >
                <FaArrowLeft /> Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
