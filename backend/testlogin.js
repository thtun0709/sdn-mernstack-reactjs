// testLogin.js
const mongoose = require('mongoose');
const Member = require('./models/memberModel'); // đường dẫn model của anh
require('dotenv').config();

async function testLogin() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'perfume-app' });
  console.log('✅ Connected to MongoDB');

  // 🧠 Nhập email và mật khẩu muốn test
  const email = 'user2@gmail.com'; // thay bằng email muốn kiểm tra
  const passwordToTest = '123456'; // mật khẩu anh muốn thử đăng nhập

  const user = await Member.findOne({ email });
  if (!user) {
    console.log('❌ Không tìm thấy người dùng!');
    process.exit(0);
  }

  console.log('\n=== User tìm thấy ===');
  console.log('Email:', user.email);
  console.log('Password trong DB:', user.password);

  // 🔍 Kiểm tra password có hash chưa
  if (!user.password.startsWith('$2')) {
    console.log('⚠️  Mật khẩu này chưa được hash bằng bcrypt (lưu plain text)');
  } else {
    console.log('✅ Mật khẩu này đã được hash bằng bcrypt');
  }

  // ✅ Kiểm tra so sánh mật khẩu
  const match = await user.matchPassword(passwordToTest);
  console.log('\n=== Kết quả kiểm tra ===');
  console.log(`Thử mật khẩu "${passwordToTest}" => ${match ? '✅ ĐÚNG' : '❌ SAI'}`);

  mongoose.disconnect();
}

testLogin().catch((err) => {
  console.error('🔥 Lỗi:', err);
  mongoose.disconnect();
});
