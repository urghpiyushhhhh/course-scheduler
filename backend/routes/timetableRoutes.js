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
    console.error("❌ Error fetching timetable:", err);
    res.status(500).json({ message: "Failed to fetch timetable" });
  }
});

// 🔍 GET single timetable entry
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id).populate("course");
    if (!entry) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    res.json(entry);
  } catch (err) {
    console.error("❌ Error fetching timetable entry:", err);
    res.status(500).json({ message: "Failed to fetch timetable entry" });
  }
});

// ➕ POST: Add new timetable entry (Admin only)
router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { course, teacher, day, startTime, endTime, classroom } = req.body;

    if (!course || !teacher || !day || !startTime || !endTime || !classroom) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: "Start time must be earlier than end time" });
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
      const reason = conflict.classroom === classroom
        ? `Classroom "${classroom}" is already booked at this time on ${day}.`
        : `Teacher "${teacher}" is already scheduled at this time on ${day}.`;
      return res.status(400).json({
        message: `⚠️ Schedule conflict: ${reason}`,
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

    const populated = await newSlot.populate("course");
    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Error creating timetable entry:", err);
    res.status(500).json({ message: "Class could not be added due to server error" });
  }
});

// ✏️ PUT: Update timetable entry (Admin only)
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const { course, teacher, day, startTime, endTime, classroom } = req.body;

    if (startTime && endTime && startTime >= endTime) {
      return res.status(400).json({ message: "Start time must be earlier than end time" });
    }

    // Check conflict excluding current item
    if (day && startTime && endTime && (classroom || teacher)) {
      const conflict = await Timetable.findOne({
        _id: { $ne: req.params.id },
        day,
        $or: [
          ...(classroom ? [{ classroom, startTime: { $lt: endTime }, endTime: { $gt: startTime } }] : []),
          ...(teacher ? [{ teacher, startTime: { $lt: endTime }, endTime: { $gt: startTime } }] : []),
        ],
      });

      if (conflict) {
        const reason = conflict.classroom === classroom
          ? `Classroom "${classroom}" is already booked at this time on ${day}.`
          : `Teacher "${teacher}" is already scheduled at this time on ${day}.`;
        return res.status(400).json({ message: `⚠️ Schedule conflict: ${reason}` });
      }
    }

    const updated = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("course");

    if (!updated) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    res.json({ message: "Class updated successfully", updated });
  } catch (err) {
    console.error("❌ Error updating timetable entry:", err);
    res.status(500).json({ message: "Failed to update class" });
  }
});

// 🗑️ DELETE a timetable entry (Admin only)
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const deleted = await Timetable.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting timetable entry:", err);
    res.status(500).json({ message: "Failed to delete class" });
  }
});

export default router;
