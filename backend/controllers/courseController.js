import Course from "../models/courseModel.js";

// ✅ Fetch all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// ✅ Count courses (for admin stats)
export const getCourseCount = async (req, res) => {
  try {
    const count = await Course.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to count courses" });
  }
};

// ✅ Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

// ✅ Add course (Admin only)
export const createCourse = async (req, res) => {
  try {
    const { name, code, department, teacher } = req.body;

    if (!name || !code || !department || !teacher) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Course.findOne({ code: code.trim().toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = await Course.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      department: department.trim(),
      teacher: teacher.trim(),
    });

    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    console.error("❌ Add Course Error:", err);
    res.status(500).json({ message: "Failed to add course" });
  }
};

// ✅ Update course (Admin only)
export const updateCourse = async (req, res) => {
  try {
    const { name, code, department, teacher } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (code) updateData.code = code.trim().toUpperCase();
    if (department) updateData.department = department.trim();
    if (teacher) updateData.teacher = teacher.trim();

    // Check if new code conflicts with another course
    if (updateData.code) {
      const exists = await Course.findOne({
        code: updateData.code,
        _id: { $ne: req.params.id },
      });
      if (exists) {
        return res.status(400).json({ message: "Course code already in use by another course" });
      }
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated", updated });
  } catch (err) {
    console.error("❌ Update Course Error:", err);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Delete course (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("❌ Delete Course Error:", err);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
