const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// [POST] Đăng ký
router.post("/register", authController.postRegister);

// [POST] Đăng nhập
router.post("/login", authController.login);

// [GET] Lấy thông tin người dùng hiện tại
router.get("/me", authController.getMe);

// [GET] Đăng xuất
router.get("/logout", authController.logout);

module.exports = router;
