const express = require("express");
const router = express.Router();
const perfumeController = require("../controllers/perfumeController");
const commentController = require("../controllers/commentController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// REST API routes cho React
router.get("/", perfumeController.getAllPerfumes);
router.get("/:id", perfumeController.getPerfumeDetail);
router.post("/", isAuthenticated, isAdmin, upload.single("image"), perfumeController.addPerfume);
router.put("/:id", isAuthenticated, isAdmin, upload.single("image"), perfumeController.updatePerfume);
router.delete("/:id", isAuthenticated, isAdmin, perfumeController.deletePerfume);

// Optional: thêm rating/comment
router.post("/:id/rate", isAuthenticated, perfumeController.addRating);
module.exports = router;
