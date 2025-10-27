import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { FaFloppyDisk, FaArrowLeft } from "react-icons/fa6";
import api from "../../api/axios";
import { App } from "antd";

export default function BrandForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const [brand, setBrand] = useState({
        name: "",
        country: "",
        foundedYear: "",
        website: "",
        description: "",
    });
    const [error, setError] = useState("");
    const [allBrands, setAllBrands] = useState([]);

    const isEdit = Boolean(id);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get("/api/brands");
                setAllBrands(res.data || []);
            } catch {
                console.error("Không thể tải danh sách thương hiệu.");
            }
        };
        fetchBrands();

        if (isEdit) {
            api
                .get(`/api/brands/${id}`)
                .then((res) => setBrand(res.data))
                .catch(() => setError("Không tải được dữ liệu thương hiệu."));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBrand((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!brand.name.trim() && !isEdit) {
                setError("Tên thương hiệu là bắt buộc.");
                return;
            }

            const exists = allBrands.some(
                (b) =>
                    b.name.toLowerCase() === brand.name.trim().toLowerCase() &&
                    b._id !== id
            );
            if (exists) {
                message.error("Đã có brand nước hoa này rồi!");
                return;
              }

            if (isEdit) {
                await api.put(`/api/brands/${id}`, brand);
                message.success("Cập nhật thương hiệu thành công!");
            } else {
                await api.post("/api/brands", brand);
                message.success("Thêm thương hiệu mới thành công!");
            }

            navigate("/admin/brands");
        } catch (err) {
            console.error(err);
            setError("Lưu dữ liệu thất bại. Vui lòng thử lại!");
        }
    };

    return (
        <div className="flex">
            <AdminSidebar />

            <div className="ml-56 flex-1 flex justify-center mt-28">
                <div className="bg-[#151515] p-9 rounded-xl w-[600px] shadow-[0_0_20px_rgba(255,0,50,0.2)]">
                    <h2 className="text-center text-[#c41e3a] text-2xl font-semibold mb-6">
                        {isEdit ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                    </h2>

                    {error && (
                        <p className="text-[#ff5050] text-center mb-4 font-medium">{error}</p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2 text-[#ccc] font-medium">
                            Tên thương hiệu *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={brand.name}
                            onChange={handleChange}
                            required
                            disabled={isEdit} // ✅ Không cho chỉnh sửa khi edit
                            className={`w-full p-3 mb-4 rounded-md border-none outline-none focus:ring-2 focus:ring-[#c41e3a] ${isEdit
                                    ? "bg-[#333] text-gray-400 cursor-not-allowed"
                                    : "bg-[#222] text-white"
                                }`}
                        />

                        <label className="block mb-2 text-[#ccc] font-medium">Quốc gia</label>
                        <input
                            type="text"
                            name="country"
                            value={brand.country}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                        />

                        <label className="block mb-2 text-[#ccc] font-medium">
                            Năm thành lập
                        </label>
                        <input
                            type="number"
                            name="foundedYear"
                            min="1800"
                            max={new Date().getFullYear()}
                            value={brand.foundedYear}
                            onChange={handleChange}
                            className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                        />

                        <label className="block mb-2 text-[#ccc] font-medium">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={brand.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="w-full p-3 mb-4 rounded-md bg-[#222] text-white border-none outline-none focus:ring-2 focus:ring-[#c41e3a]"
                        />

                        <label className="block mb-2 text-[#ccc] font-medium">Mô tả</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={brand.description}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md bg-[#222] text-white border-none outline-none resize-y focus:ring-2 focus:ring-[#c41e3a]"
                        />

                        <div className="grid grid-cols-2 gap-5 mt-6">
                            <button
                                type="submit"
                                className="btn-action bg-[#c41e3a] hover:bg-[#a0142e] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
                            >
                                <FaFloppyDisk /> {isEdit ? "Cập nhật" : "Lưu"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/brands")}
                                className="btn-action bg-[#333] hover:bg-[#444] text-white py-3 rounded-md flex justify-center items-center gap-2 font-medium transition"
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
