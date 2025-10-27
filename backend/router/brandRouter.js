const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { isAuthenticated,isAdmin } = require('../middlewares/authMiddleware');


router.get("/", async (req, res) => {
  try {
    const brands = await brandController.apiGetAllBrands(req, res);
    // This will be handled by the controller, but we need to ensure consistent format
  } catch (err) {
    res.status(500).json({ message: "Failed to load brands" });
  }
});
router.get("/:id", brandController.apiGetBrandById);
router.post("/", isAdmin, brandController.apiAddBrand);
router.put("/:id", isAdmin, brandController.apiUpdateBrand);
router.delete("/:id", isAdmin, brandController.apiDeleteBrand);
// Routes cho Brand CRUD


module.exports = router;
