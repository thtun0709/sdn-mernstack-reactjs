const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Chỉ admin mới xem được danh sách user
router.get("/", isAuthenticated, isAdmin, userController.getAllUsers);

// ✅ Toggle trạng thái (admin)
router.put("/toggle/:id", isAuthenticated, isAdmin, userController.toggleUserStatus);

// ✅ Xóa user (admin)
router.delete("/:id", isAuthenticated, isAdmin, userController.deleteUser);


// ✅ Admin xem hồ sơ từng user
router.get("/profile/:id", isAuthenticated, isAdmin, userController.getUserById);

// ✅ Profile cho user đăng nhập
router.get("/profile", isAuthenticated, userController.getProfile);
router.post("/profile/update", isAuthenticated, userController.updateProfile);

module.exports = router;
