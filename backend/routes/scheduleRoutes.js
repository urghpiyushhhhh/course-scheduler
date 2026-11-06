import express from "express";
import {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📅 GET all schedules (authenticated users)
router.get("/", verifyToken, getAllSchedules);

// 🔍 GET single schedule
router.get("/:id", verifyToken, getScheduleById);

// ➕ POST create schedule (Admin only)
router.post("/", verifyToken, adminOnly, createSchedule);

// ✏️ PUT update schedule (Admin only)
router.put("/:id", verifyToken, adminOnly, updateSchedule);

// 🗑️ DELETE schedule (Admin only)
router.delete("/:id", verifyToken, adminOnly, deleteSchedule);

export default router;
