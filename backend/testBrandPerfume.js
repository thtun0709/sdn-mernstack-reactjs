// testBrandPerfume.js
const mongoose = require('mongoose');
const Brand = require('./models/brandModel');
const Perfume = require('./models/perfumeModel');
require('dotenv').config();

async function testBrandPerfume() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'perfume-app' });
  console.log('✅ Connected to MongoDB');

  // Lấy tất cả brands
  const brands = await Brand.find().limit(5);
  console.log('\n=== BRANDS ===');
  brands.forEach(b => {
    console.log(`- ID: ${b._id} | Name: ${b.name}`);
  });

  // Lấy tất cả perfumes
  const perfumes = await Perfume.find().limit(5);
  console.log('\n=== PERFUMES ===');
  perfumes.forEach(p => {
    console.log(`- Name: ${p.name || p.perfumeName} | Brand: ${p.brand} | Type: ${typeof p.brand}`);
  });

  // Test đếm perfume theo brand
  console.log('\n=== PERFUME COUNT BY BRAND ===');
  for (const brand of brands) {
    const count = await Perfume.countDocuments({ brand: brand.name });
    console.log(`- Brand "${brand.name}": ${count} perfumes`);
  }

  mongoose.disconnect();
}

testBrandPerfume().catch((err) => {
  console.error('🔥 Lỗi:', err);
  mongoose.disconnect();
});
