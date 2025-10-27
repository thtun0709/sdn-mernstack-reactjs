// Kiểm tra người dùng đã đăng nhập hay chưa
const Member = require("../models/memberModel");

exports.isAuthenticated = async (req, res, next) => {
  try {
    console.log("🔍 Kiểm tra session:", req.session?.member);
    // ✅ Kiểm tra session đăng nhập
    if (req.session && req.session.member) {
      const user = await Member.findById(req.session.member._id);

      // ❌ Nếu tài khoản không tồn tại (đã bị xóa)
      if (!user) {
        // 👉 user đã bị xóa khỏi DB
        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          return res.status(401).json({ message: "Tài khoản đã bị xóa hoặc vô hiệu hóa" });
        });
      } 
      // ❌ Nếu tài khoản bị khóa (tuỳ anh có isActive hay không)
      if (user.isActive === false) {
        req.session.destroy(() => console.log("⚠️ Session destroyed: user locked"));
        return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
      }

      // ✅ Hợp lệ → cho qua
      req.user = user;
      return next();
    }

    // ❌ Chưa đăng nhập
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn" });
  } catch (err) {
    console.error("❌ Lỗi trong isAuthenticated:", err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};


// Kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
  const member = req.session.member;
  if (!member || member.role !== "admin") {
    return res.status(403).send("🚫 Bạn không có quyền truy cập!");
  }
  next();
};

// Dùng khi muốn hiển thị khác biệt (VD: header) nếu đã đăng nhập
exports.isLoggedIn = (req, res, next) => {
  res.locals.isLoggedIn = !!req.session.member;
  next();
};
