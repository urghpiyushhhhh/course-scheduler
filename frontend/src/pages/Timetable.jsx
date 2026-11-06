import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Timetable = () => {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newSlot, setNewSlot] = useState({
    course: "",
    teacher: "",
    day: "",
    startTime: "",
    endTime: "",
    classroom: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
    fetchCourses();
  }, [user]);

  const fetchTimetable = async () => {
    try {
      const { data } = await api.get("/timetable");

      // Filter results based on role
      if (user?.role === "Teacher") {
        setTimetable(data.filter((t) => t.teacher === user?.name));
      } else {
        setTimetable(data); // Admin and Student see all
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

  // Auto-populate teacher when a course is chosen
  const handleCourseChange = (courseId) => {
    const selected = courses.find((c) => c._id === courseId);
    setNewSlot((prev) => ({
      ...prev,
      course: courseId,
      teacher: selected ? selected.teacher : prev.teacher,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newSlot.startTime >= newSlot.endTime) {
      alert("Start time must be earlier than end time");
      return;
    }

    try {
      await api.post("/timetable", newSlot);
      fetchTimetable();
      setNewSlot({
        course: "",
        teacher: "",
        day: "",
        startTime: "",
        endTime: "",
        classroom: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add class");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this scheduled class?")) return;
    try {
      await api.delete(`/timetable/${id}`);
      fetchTimetable();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete class");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 text-center text-red-700 font-medium">
        Loading timetable...
      </div>
    );
  }

  return (
    <div className="pt-20 p-8 min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-700">
        Weekly Timetable 🕒
      </h1>

      {/* Admin Only - Add Class Form */}
      {user?.role === "Admin" && (
        <div className="bg-white shadow-md p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">+ Schedule New Class</h2>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Select Course</label>
              <select
                value={newSlot.course}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Teacher</label>
              <input
                type="text"
                placeholder="Teacher Name"
                value={newSlot.teacher}
                onChange={(e) => setNewSlot({ ...newSlot, teacher: e.target.value })}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Day of Week</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              >
                <option value="">Select Day</option>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day) => (
                    <option key={day} value={day}>{day}</option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Start Time</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">End Time</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Classroom</label>
              <input
                type="text"
                placeholder="e.g. Room 301, Lab A"
                value={newSlot.classroom}
                onChange={(e) => setNewSlot({ ...newSlot, classroom: e.target.value })}
                className="w-full p-2 border rounded-lg text-black bg-white"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg font-semibold bg-red-700 text-white hover:bg-red-800 transition cursor-pointer"
              >
                Add Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timetable Table */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Scheduled Classes</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead>
              <tr className="bg-indigo-50 text-left">
                <th className="py-2.5 px-4 border-b border-gray-200">Course</th>
                <th className="py-2.5 px-4 border-b border-gray-200">Teacher</th>
                <th className="py-2.5 px-4 border-b border-gray-200">Day</th>
                <th className="py-2.5 px-4 border-b border-gray-200">Time</th>
                <th className="py-2.5 px-4 border-b border-gray-200">Classroom</th>
                {user?.role === "Admin" && (
                  <th className="py-2.5 px-4 border-b border-gray-200">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {timetable.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-2.5 px-4 font-medium text-gray-900">
                    {t.course?.name || "Unknown Course"}
                    {t.course?.code && (
                      <span className="text-xs text-gray-500 ml-1.5">({t.course.code})</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">{t.teacher}</td>
                  <td className="py-2.5 px-4 text-gray-700">{t.day}</td>
                  <td className="py-2.5 px-4 text-gray-700">
                    {t.startTime} - {t.endTime}
                  </td>
                  <td className="py-2.5 px-4 text-gray-700">{t.classroom}</td>

                  {/* Only Admins can delete */}
                  {user?.role === "Admin" && (
                    <td className="py-2.5 px-4">
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {timetable.length === 0 && (
          <p className="text-gray-500 mt-6 text-center italic">
            No classes scheduled yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Timetable;
