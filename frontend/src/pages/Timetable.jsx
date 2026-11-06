import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Timetable = () => {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newSlot, setNewSlot] = useState({
    course: "",
    teacher: user?.name || "",
    day: "",
    startTime: "",
    endTime: "",
    classroom: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
    fetchCourses();
  }, []);

  const fetchTimetable = async () => {
    try {
      const { data } = await api.get("/timetable");

      // Filter results based on role
      if (user.role === "Teacher") {
        setTimetable(data.filter((t) => t.teacher === user.name));
      } else if (user.role === "Student") {
        setTimetable(data); // all, but read-only
      } else {
        setTimetable(data); // Admin sees all
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetable", newSlot);
      fetchTimetable();
      setNewSlot({
        course: "",
        teacher: user.name,
        day: "",
        startTime: "",
        endTime: "",
        classroom: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add class");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/timetable/${id}`);
      fetchTimetable();
    } catch (err) {
      console.error(err);
      alert("Failed to delete class");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-indigo-600">Loading timetable...</div>;

  return (
    <div className=" pt-20 p-8 min-h-screen bg-slate-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-700">
        Weekly Timetable 🕒
      </h1>

      {/* Admin Only - Add Class Form */}
      {user.role === "Admin" && (
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white/10 p-6 rounded-xl backdrop-blur-lg shadow-lg"
        >
          <select
            value={newSlot.course}
            onChange={(e) => setNewSlot({ ...newSlot, course: e.target.value })}
            className="p-2 border rounded-lg text-black"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Teacher"
            value={newSlot.teacher}
            onChange={(e) => setNewSlot({ ...newSlot, teacher: e.target.value })}
            className="p-2 border rounded-lg text-black"
            required
          />

          <select
            value={newSlot.day}
            onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
            className="p-2 border rounded-lg text-black"
            required
          >
            <option value="">Select Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
              (day) => (
                <option key={day}>{day}</option>
              )
            )}
          </select>

          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
            className="p-2 border rounded-lg text-black "
            required
          />
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
            className="p-2 border rounded-lg text-black"
            required
          />
          <input
            type="text"
            placeholder="Classroom"
            value={newSlot.classroom}
            onChange={(e) => setNewSlot({ ...newSlot, classroom: e.target.value })}
            className="p-2 border rounded-lg text-black"
            required
          />

          <button
            type="submit"
            className=" px-4 py-2 rounded-lg font-semibold bg-red-700 text-white hover:bg-red-100 hover:text-red-900 transition"
          >
            Add Class
          </button>
        </form>
      )}

      {/* Timetable Table */}
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Scheduled Classes</h2>

        <table className="min-w-full border border-white/20 rounded-xl">
          <thead>
            <tr className="bg-white/10">
              <th className="py-2 px-4 border-b border-white/20 text-left">Course</th>
              <th className="py-2 px-4 border-b border-white/20 text-left">Teacher</th>
              <th className="py-2 px-4 border-b border-white/20 text-left">Day</th>
              <th className="py-2 px-4 border-b border-white/20 text-left">Time</th>
              <th className="py-2 px-4 border-b border-white/20 text-left">Classroom</th>
              {user.role === "Admin" && (
                <th className="py-2 px-4 border-b border-white/20 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {timetable.map((t) => (
              <tr key={t._id} className="hover:bg-white/10 transition">
                <td className="py-2 px-4 border-b border-white/20">{t.course?.name}</td>
                <td className="py-2 px-4 border-b border-white/20">{t.teacher}</td>
                <td className="py-2 px-4 border-b border-white/20">{t.day}</td>
                <td className="py-2 px-4 border-b border-white/20">
                  {t.startTime} - {t.endTime}
                </td>
                <td className="py-2 px-4 border-b border-white/20">{t.classroom}</td>

                {/* Only Admins can delete */}
                {user.role === "Admin" && (
                  <td className="py-2 px-4 border-b border-white/20">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {timetable.length === 0 && (
          <p className="text-white/70 mt-4 text-center italic">
            No classes scheduled yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Timetable;
