import express from "express";
import Course from "../models/courseModel.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// ✅ Count courses (for admin stats)
router.get("/count", async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to count courses" });
  }
});

// ✅ Add course (Admin only)
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { name, code, department, teacher } = req.body;

    if (!name || !code || !department || !teacher)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Course.findOne({ code });
    if (exists)
      return res.status(400).json({ message: "Course code already exists" });

    const course = await Course.create({ name, code, department, teacher });

    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    res.status(500).json({ message: "Failed to add course" });
  }
});

// ✅ Update course (Admin only)
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Course updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update course" });
  }
});

// ✅ Delete course (Admin only)
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
});

export default router;
