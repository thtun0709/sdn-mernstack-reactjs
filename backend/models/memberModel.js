const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const memberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    YOB: { type: Number },
    gender: { type: Boolean },
    role: { type: String, enum: ["member", "admin"], default: "member" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔐 Hash mật khẩu trước khi lưu
memberSchema.pre("save", async function (next) {
  // chỉ hash khi tạo mới hoặc password bị sửa
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ So sánh mật khẩu khi đăng nhập
memberSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log("🔍 So sánh mật khẩu:", enteredPassword, "→", isMatch);
    return isMatch;
  } catch (err) {
    console.error("❌ Lỗi khi so sánh mật khẩu:", err);
    return false;
  }
};



module.exports = mongoose.model("Member", memberSchema);
