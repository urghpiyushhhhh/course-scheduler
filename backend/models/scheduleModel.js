import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: String,
  day: String,
  time: String,
});
export default mongoose.model("Schedule", scheduleSchema);
