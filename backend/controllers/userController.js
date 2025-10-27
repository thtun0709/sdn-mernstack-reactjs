// controllers/userController.js
const Member = require("../models/memberModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// 📦 [GET] Lấy tất cả user (React)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Member.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 🔄 [PUT] Toggle user active/inactive (React)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await Member.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "Cập nhật trạng thái thành công!", user });
  } catch (err) {
    console.error("❌ Lỗi khi toggle:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// 🗑️ [DELETE] Xóa user (React)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Xóa user trong DB
    const deletedUser = await Member.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user để xóa" });
    }

    // 2️⃣ Xóa session của user trong Mongo collection "sessions"
    const db = mongoose.connection.db;
    if (!db) {
      console.error("❌ Không thể truy cập mongoose.connection.db");
      return res.status(500).json({ message: "Database not connected" });
    }

    const sessionCollection = db.collection("sessions");
    const allSessions = await sessionCollection.find({}).toArray();

    for (const s of allSessions) {
      try {
        const data = JSON.parse(s.session);
        if (data.member && data.member._id === userId) {
          await sessionCollection.deleteOne({ _id: s._id });
          console.log(`🗑️ Session deleted for user ${userId}`);
        }
      } catch (e) {
        console.warn("⚠️ Lỗi parse session:", e.message);
      }
    }

    res.json({ message: "User deleted and session invalidated" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error", error: err.stack });
  }
};

// 👤 [GET] Lấy thông tin hồ sơ cá nhân (React)
exports.getProfile = async (req, res) => {
  try {
    const sessionMember = req.session.member;
    if (!sessionMember || !sessionMember._id)
      return res.status(401).json({ message: "Chưa đăng nhập!" });

    const user = await Member.findById(sessionMember._id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.json({ user });
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// ✏️ [POST] Cập nhật hồ sơ cá nhân (React)
exports.updateProfile = async (req, res) => {
  try {
    const sessionMember = req.session.member;
    if (!sessionMember || !sessionMember._id)
      return res.status(401).json({ message: "Chưa đăng nhập!" });

    const { name, email, password } = req.body;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password && password.trim() !== "")
      updatedData.password = await bcrypt.hash(password, 10);

    const updatedUser = await Member.findByIdAndUpdate(
      sessionMember._id,
      updatedData,
      { new: true }
    ).select("-password");

    // ✅ Cập nhật session để đồng bộ
    req.session.member.name = updatedUser.name;
    req.session.member.email = updatedUser.email;

    res.json({
      message: "Cập nhật thành công!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật hồ sơ:", err);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};


// 👤 [GET] Lấy thông tin user theo ID (admin xem hồ sơ người dùng)
exports.getUserById = async (req, res) => {
  try {
    const user = await Member.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ user });
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin user theo ID:", err);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
