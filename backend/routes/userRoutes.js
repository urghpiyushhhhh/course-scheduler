import express from "express";
import User from "../models/userModel.js";
const router = express.Router();

// Get all teachers list
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "Teacher" }).select("name");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// Count teachers
router.get("/teachers/count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "Teacher" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count teachers" });
  }
});

// Count students
router.get("/students/count", async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "Student" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to count students" });
  }
});

export default router;
