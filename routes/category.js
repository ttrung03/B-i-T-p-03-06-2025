const express = require("express");
const router = express.Router();
const Category = require("../schemas/category");

// Lấy tất cả danh mục
router.get("/", async (req, res) => {
  try {
    let categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Lấy danh mục theo ID
router.get("/:id", async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) throw new Error("Danh mục không tồn tại");

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Tạo danh mục mới
router.post("/", async (req, res) => {
  try {
    let newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Cập nhật danh mục theo ID
router.put("/:id", async (req, res) => {
  try {
    let updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) throw new Error("Danh mục không tồn tại");

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Xóa danh mục
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
