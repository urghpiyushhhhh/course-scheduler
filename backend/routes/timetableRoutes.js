import express from "express";
import Timetable from "../models/timetableModel.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📅 GET all timetable entries
router.get("/", verifyToken, async (req, res) => {
  try {
    const timetable = await Timetable.find().populate("course");
    res.json(timetable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
});

// ➕ POST: Add new timetable entry (Admin only)
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { course, teacher, day, startTime, endTime, classroom } = req.body;

    if (!course || !teacher || !day || !startTime || !endTime || !classroom) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🕒 Conflict detection logic
    const conflict = await Timetable.findOne({
      day,
      $or: [
        {
          classroom,
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
        {
          teacher,
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflict) {
      return res.status(400).json({
        message: "⚠️ Schedule conflict — this time slot overlaps with another class!",
      });
    }

    // ✅ Create the new class slot
    const newSlot = await Timetable.create({
      course,
      teacher,
      day,
      startTime,
      endTime,
      classroom,
    });

    res.status(201).json(newSlot);
  } catch (err) {
    console.error("❌ Error creating timetable entry:", err);
    res.status(500).json({ message: "Class can not be added as it is conflicting with some other class." });
  }
});

// 🗑️ DELETE a timetable entry (Admin only)
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete class" });
  }
});

export default router;
