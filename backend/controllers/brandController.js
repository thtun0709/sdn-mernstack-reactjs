// controllers/brandController.js
const Brand = require('../models/brandModel');
const Perfume = require('../models/perfumeModel'); // Perfume.brand hiện đang lưu là chuỗi (tên brand)

// // Hiển thị danh sách thương hiệu
// exports.getAllBrands = async (req, res) => {
//   try {
//     const brands = await Brand.find().sort({ name: 1 });
//     res.render('brands/list', {
//       title: 'Danh sách thương hiệu',
//       member: req.session.member,
//       brands,
//       error: req.query.error || null,
//     });
//   } catch (err) {
//     console.error('❌ getAllBrands error:', err);
//     res.status(500).send('Lỗi server');
//   }
// };

// // Hiển thị form thêm thương hiệu
// exports.showAddForm = (req, res) => {
//   if (!req.session.member || req.session.member.role !== 'admin') {
//     return res.status(403).send('Truy cập bị từ chối');
//   }
//   res.render('brands/form', {
//     title: 'Thêm thương hiệu',
//     member: req.session.member,
//     brand: null,
//     error: null,
//   });
// };

// // Xử lý thêm mới thương hiệu
// exports.addBrand = async (req, res) => {
//   if (!req.session.member || req.session.member.role !== 'admin') {
//     return res.status(403).send('Truy cập bị từ chối');
//   }
//   try {
//     const { name, description, country, foundedYear, website } = req.body;
//     const brand = new Brand({
//       name,
//       description,
//       country,
//       foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
//       website,
//     });
//     await brand.save();
//     res.redirect('/brands');
//   } catch (err) {
//     console.error('❌ addBrand error:', err);
//     res.status(500).send('Lỗi khi thêm thương hiệu');
//   }
// };

// // Hiển thị form chỉnh sửa thương hiệu
// exports.showEditForm = async (req, res) => {
//   if (!req.session.member || req.session.member.role !== 'admin') {
//     return res.status(403).send('Truy cập bị từ chối');
//   }
//   try {
//     const brand = await Brand.findById(req.params.id);
//     if (!brand) return res.status(404).send('Không tìm thấy thương hiệu');
//     res.render('brands/form', {
//       title: 'Chỉnh sửa thương hiệu',
//       member: req.session.member,
//       brand,
//       error: null,
//     });
//   } catch (err) {
//     console.error('❌ showEditForm error:', err);
//     res.status(500).send('Lỗi khi tải form chỉnh sửa');
//   }
// };

// // Cập nhật thương hiệu
// exports.updateBrand = async (req, res) => {
//   if (!req.session.member || req.session.member.role !== 'admin') {
//     return res.status(403).send('Truy cập bị từ chối');
//   }
//   try {
//     const { name, description, country, foundedYear, website } = req.body;
//     const updateData = {
//       name,
//       description,
//       country,
//       foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
//       website,
//     };

//     await Brand.findByIdAndUpdate(req.params.id, updateData);
//     res.redirect('/brands');
//   } catch (err) {
//     console.error('❌ updateBrand error:', err);
//     res.status(500).send('Lỗi khi cập nhật thương hiệu');
//   }
// };

// // Xóa thương hiệu (kiểm tra ràng buộc: Perfume.brand là tên chuỗi)
// exports.deleteBrand = async (req, res) => {
//   if (!req.session.member || req.session.member.role !== 'admin') {
//     return res.status(403).send('Truy cập bị từ chối');
//   }

//   try {
//     // Tìm brand theo id trước
//     const brand = await Brand.findById(req.params.id);
//     if (!brand) {
//       // truyền error an toàn qua query string
//       return res.redirect('/brands?error=' + encodeURIComponent('Brand not found.'));
//     }

//     // Kiểm tra perfume có đang dùng brand.name hay không
//     // (Do Perfume.brand hiện là chuỗi tên brand)
//     const perfumesWithBrand = await Perfume.find({ brand: brand.name }).limit(1); // chỉ cần biết có hay không

//     if (perfumesWithBrand && perfumesWithBrand.length > 0) {
//       const message = `You cannot delete this brand because it is associated with some perfume(s). Please delete those perfumes first.`;
//       return res.redirect('/brands?error=' + encodeURIComponent(message));
//     }

//     // Nếu không có perfume nào gắn brand, cho phép xóa
//     await Brand.findByIdAndDelete(req.params.id);
//     return res.redirect('/brands');
//   } catch (err) {
//     console.error('❌ deleteBrand error:', err);
//     return res.redirect('/brands?error=' + encodeURIComponent('Error deleting brand.'));
//   }
// };

// // Hiển thị chi tiết thương hiệu
// exports.getBrandDetail = async (req, res) => {
//   try {
//     const brand = await Brand.findById(req.params.id);
//     if (!brand) {
//       return res.status(404).send('Không tìm thấy thương hiệu');
//     }

//     res.render('brands/detail', {
//       title: brand.name,
//       brand,
//       member: req.session.member,
//     });
//   } catch (err) {
//     console.error('❌ getBrandDetail error:', err);
//     res.status(500).send('Lỗi khi tải chi tiết thương hiệu');
//   }
// };




exports.apiGetAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (err) {
    console.error("❌ apiGetAllBrands:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy brand theo ID (GET /api/brands/:id)
exports.apiGetBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm brand (POST /api/brands)
exports.apiAddBrand = async (req, res) => {
  try {
    const { name, description, country, foundedYear, website } = req.body;
    const brand = new Brand({
      name,
      description,
      country,
      foundedYear: foundedYear ? parseInt(foundedYear) : undefined,
      website,
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (err) {
    console.error("❌ apiAddBrand:", err);
    res.status(500).json({ message: "Error adding brand", error: err.message });
  }
};

// Cập nhật brand (PUT /api/brands/:id)
exports.apiUpdateBrand = async (req, res) => {
  try {
    const { name, description, country, foundedYear, website } = req.body;
    const updated = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, country, foundedYear, website },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Brand not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ apiUpdateBrand:", err);
    res.status(500).json({ message: "Error updating brand" });
  }
};

// Xóa brand (DELETE /api/brands/:id)
exports.apiDeleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      console.log("❌ Brand not found:", req.params.id);
      return res.status(404).json({ message: "Brand not found" });
    }

    console.log("🔍 Checking perfumes for brand:", brand.name);
    
    // Kiểm tra xem có perfume nào đang sử dụng brand này không
    const perfumeCount = await Perfume.countDocuments({ brand: brand.name });
    
    console.log("📊 Perfume count:", perfumeCount);
    
    if (perfumeCount > 0) {
      console.log("⚠️ Cannot delete brand, has perfumes");
      return res.status(400).json({ 
        message: `Không thể xóa thương hiệu này vì có ${perfumeCount} nước hoa đang sử dụng`,
        perfumeCount: perfumeCount,
        canDelete: false
      });
    }

    console.log("✅ Deleting brand:", brand.name);
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ 
      message: "Xóa thương hiệu thành công",
      canDelete: true
    });
  } catch (err) {
    console.error("❌ apiDeleteBrand:", err);
    res.status(500).json({ message: "Error deleting brand" });
  }
};
