const Perfume = require('../models/perfumeModel');
const Comment = require('../models/commentModel');
const Brand = require('../models/brandModel');
const mongoose = require('mongoose');

// 🟢 [GET] Lấy danh sách tất cả nước hoa
exports.getAllPerfumes = async (req, res) => {
  try {
    const perfumes = await Perfume.find().lean();
    
    // Tính avgRating cho mỗi perfume từ comments
    const perfumesWithRating = await Promise.all(
      perfumes.map(async (p) => {
        const comments = await Comment.find({ perfumeId: p._id }).lean();
        let avgRating = 0;
        if (comments.length > 0) {
          const ratings = comments.map(c => c.rating || 0);
          avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        }
        
        return {
          ...p,
          perfumeName: p.perfumeName || p.name,
          avgRating: Number(avgRating.toFixed(1)),
          totalComments: comments.length
        };
      })
    );
    
    res.json({ perfumes: perfumesWithRating });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách nước hoa:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách nước hoa" });
  }
};

// 🟢 [GET] Lấy chi tiết 1 nước hoa
exports.getPerfumeDetail = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id).lean();

    if (!perfume) {
      return res.status(404).json({ error: "Không tìm thấy nước hoa" });
    }

    // Lấy comment (nếu cần)
    const comments = await Comment.find({ perfumeId: perfume._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    // Tính điểm trung bình
    let avgRating = 0;
    if (comments.length > 0) {
      const ratings = comments.map(c => c.rating || 0);
      avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }

    res.json({ perfume, comments, avgRating });
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết nước hoa:", err);
    res.status(500).json({ error: "Lỗi server khi lấy chi tiết nước hoa" });
  }
};

// 🟢 [POST] Thêm nước hoa mới
exports.addPerfume = async (req, res) => {
  try {
    const {
      name,
      perfumeName, // Thêm field này từ frontend
      price,
      description,
      gender,
      brand,
      concentration,
      ingredients,
      volume,
      targetAudience,
      uri
    } = req.body;

    // Sử dụng perfumeName nếu có, không thì dùng name
    const finalName = perfumeName || name;
    
    if (!finalName || !brand) {
      return res.status(400).json({ error: "Thiếu tên hoặc thương hiệu" });
    }

    // Tìm brand theo tên thay vì ObjectId
    let brandDoc = await Brand.findOne({ name: brand });
    if (!brandDoc) {
      return res.status(400).json({ error: "Thương hiệu không tồn tại" });
    }

    const image = req.file
      ? `/uploads/perfumes/${req.file.filename}`
      : "/images/default_perfume.jpg";

    const perfume = new Perfume({
      name: finalName,
      perfumeName: finalName, // Lưu cả hai field để tương thích
      brand: brandDoc.name, // Lưu tên brand thay vì ObjectId
      price,
      description,
      gender,
      concentration,
      ingredients,
      volume,
      targetAudience,
      uri,
      image,
    });

    await perfume.save();
    res.status(201).json({ message: "Thêm nước hoa thành công", perfume });
  } catch (err) {
    console.error("❌ Lỗi khi thêm nước hoa:", err);
    res.status(500).json({ error: "Lỗi khi thêm nước hoa" });
  }
};

// 🟢 [PUT] Cập nhật nước hoa
exports.updatePerfume = async (req, res) => {
  try {
    const {
      name,
      perfumeName, // Thêm field này từ frontend
      price,
      description,
      gender,
      brand,
      concentration,
      ingredients,
      volume,
      targetAudience,
      uri
    } = req.body;

    // Sử dụng perfumeName nếu có, không thì dùng name
    const finalName = perfumeName || name;

    const updateData = {
      name: finalName,
      perfumeName: finalName, // Lưu cả hai field để tương thích
      price,
      description,
      gender,
      brand, // Giữ nguyên brand name
      concentration,
      ingredients,
      volume,
      targetAudience,
      uri,
    };

    if (req.file)
      updateData.image = `/uploads/perfumes/${req.file.filename}`;

    const perfume = await Perfume.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!perfume) {
      return res.status(404).json({ error: "Không tìm thấy nước hoa" });
    }

    res.json({ message: "Cập nhật nước hoa thành công", perfume });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật nước hoa:", err);
    res.status(500).json({ error: "Lỗi server khi cập nhật nước hoa" });
  }
};

// 🟢 [DELETE] Xoá nước hoa
exports.deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findByIdAndDelete(req.params.id);
    if (!perfume) {
      return res.status(404).json({ error: "Không tìm thấy nước hoa" });
    }
    res.json({ message: "Xóa nước hoa thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa nước hoa:", err);
    res.status(500).json({ error: "Lỗi server khi xóa nước hoa" });
  }
};

// 🟢 [POST] Thêm hoặc cập nhật đánh giá
exports.addRating = async (req, res) => {
  try {
    const { stars } = req.body;
    const perfumeId = req.params.id;
    const userId = req.session?.member?._id;

    if (!userId) return res.status(403).json({ error: "Chưa đăng nhập" });
    if (!stars || stars < 1 || stars > 3)
      return res.status(400).json({ error: "Số sao không hợp lệ (1–3)" });

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) return res.status(404).json({ error: "Không tìm thấy nước hoa" });

    const existing = perfume.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existing) existing.stars = stars;
    else perfume.ratings.push({ userId, stars });

    await perfume.save();
    res.json({ message: "Đánh giá thành công", perfume });
  } catch (err) {
    console.error("❌ Lỗi khi đánh giá:", err);
    res.status(500).json({ error: "Lỗi server khi đánh giá sản phẩm" });
  }
};
