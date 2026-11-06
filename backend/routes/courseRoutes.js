import express from "express";
import {
  getCourses,
  getCourseCount,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch all courses
router.get("/", getCourses);

// ✅ Count courses (for admin stats)
router.get("/count", getCourseCount);

// ✅ Get course by ID
router.get("/:id", getCourseById);

// ✅ Add course (Admin only)
router.post("/", verifyToken, adminOnly, createCourse);

// ✅ Update course (Admin only)
router.put("/:id", verifyToken, adminOnly, updateCourse);

// ✅ Delete course (Admin only)
router.delete("/:id", verifyToken, adminOnly, deleteCourse);

export default router;
