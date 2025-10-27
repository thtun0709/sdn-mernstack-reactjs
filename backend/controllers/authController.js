const Member = require("../models/memberModel");

// [POST] Đăng ký
exports.postRegister = async (req, res) => {
  try {
    const { email, password, name, YOB, gender, role } = req.body;

    const existing = await Member.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const newMember = new Member({
      email,
      password,
      name,
      YOB,
      gender,
      role: role || "member",
    });

    await newMember.save();
    return res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại!" });
  }
};

// [POST] Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟡 [LOGIN] Nhận request:", email, password);

    const member = await Member.findOne({ email });
    if (!member) {
      console.log("❌ [LOGIN] Không tìm thấy email:", email);
      return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const isMatch = await member.matchPassword(password);
    console.log("🧩 [LOGIN] Kết quả so sánh mật khẩu:", isMatch);

    if (!isMatch) {
      console.log("🚫 [LOGIN] Sai mật khẩu, TRẢ 400");
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    req.session.member = {
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
    };

    console.log("✅ [LOGIN] Đăng nhập thành công → TRẢ 200");
    return res.status(200).json({
      message: "Đăng nhập thành công!",
      user: req.session.member,
    });
  } catch (err) {
    console.error("❌ [LOGIN] Lỗi hệ thống:", err);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};





// [GET] Lấy thông tin user hiện tại
exports.getMe = (req, res) => {
  if (req.session && req.session.member) {
    return res.json({ user: req.session.member });
  }
  return res.status(401).json({ message: "Chưa đăng nhập" });
};

// [GET] Đăng xuất
exports.logout = (req, res) => {
  console.log("🔄 Đang xử lý logout request...");
  console.log("📋 Session trước khi destroy:", req.session);
  
  // Clear cookie trước khi destroy session
  res.clearCookie("connect.sid", {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  });
  
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Lỗi khi đăng xuất:", err);
      return res.status(500).json({ message: "Không thể đăng xuất!" });
    }
    console.log("✅ Session đã được destroy");
    res.json({ message: "Đăng xuất thành công" });
  });
};
