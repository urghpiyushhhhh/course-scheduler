import Schedule from "../models/scheduleModel.js";

// 📅 GET all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("course", "name code department")
      .populate("teacher", "name email");
    res.json(schedules);
  } catch (err) {
    console.error("❌ Error fetching schedules:", err);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};

// 🔍 GET single schedule by ID
export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("course", "name code department")
      .populate("teacher", "name email");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json(schedule);
  } catch (err) {
    console.error("❌ Error fetching schedule:", err);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

// ➕ POST: Create new schedule (Admin only)
export const createSchedule = async (req, res) => {
  try {
    const { course, teacher, room, day, time } = req.body;

    if (!course || !teacher || !room || !day || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Conflict detection: room conflict or teacher conflict on the same day and time
    const conflict = await Schedule.findOne({
      day,
      time,
      $or: [{ room }, { teacher }],
    });

    if (conflict) {
      return res.status(400).json({
        message: "⚠️ Schedule conflict: room or teacher already booked at this time",
      });
    }

    const newSchedule = await Schedule.create({
      course,
      teacher,
      room,
      day,
      time,
    });

    const populated = await newSchedule.populate([
      { path: "course", select: "name code department" },
      { path: "teacher", select: "name email" },
    ]);

    res.status(201).json({ message: "Schedule created successfully", schedule: populated });
  } catch (err) {
    console.error("❌ Error creating schedule:", err);
    res.status(500).json({ message: "Failed to create schedule" });
  }
};

// ✏️ PUT: Update schedule (Admin only)
export const updateSchedule = async (req, res) => {
  try {
    const { course, teacher, room, day, time } = req.body;

    // Check conflict excluding the current schedule
    if (day && time && (room || teacher)) {
      const conflictQuery = {
        _id: { $ne: req.params.id },
        day,
        time,
        $or: [],
      };
      if (room) conflictQuery.$or.push({ room });
      if (teacher) conflictQuery.$or.push({ teacher });

      const conflict = await Schedule.findOne(conflictQuery);
      if (conflict) {
        return res.status(400).json({
          message: "⚠️ Schedule conflict: room or teacher already booked at this time",
        });
      }
    }

    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("course", "name code department")
      .populate("teacher", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ message: "Schedule updated successfully", schedule: updated });
  } catch (err) {
    console.error("❌ Error updating schedule:", err);
    res.status(500).json({ message: "Failed to update schedule" });
  }
};

// 🗑️ DELETE: Delete schedule (Admin only)
export const deleteSchedule = async (req, res) => {
  try {
    const deleted = await Schedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting schedule:", err);
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};
