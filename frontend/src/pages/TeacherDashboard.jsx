import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my"); // "my" or "all"

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const myCourses = courses.filter(
    (c) => c.teacher && user?.name && c.teacher.trim().toLowerCase() === user.name.trim().toLowerCase()
  );

  const displayedCourses = activeTab === "my" ? myCourses : courses;

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-700">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>!
          </p>
        </div>

        <Link
          to="/timetable"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm w-fit"
        >
          View My Timetable 🕒
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("my")}
          className={`pb-3 font-semibold text-sm cursor-pointer border-b-2 transition ${
            activeTab === "my"
              ? "border-red-700 text-red-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Assigned Courses ({myCourses.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 font-semibold text-sm cursor-pointer border-b-2 transition ${
            activeTab === "all"
              ? "border-red-700 text-red-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Department Courses ({courses.length})
        </button>
      </div>

      {/* Courses Content */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {activeTab === "my" ? "Courses Assigned To You" : "All Available Courses"}
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading courses...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-indigo-50 text-left">
                  <th className="py-2.5 px-4 border-b">Course Name</th>
                  <th className="py-2.5 px-4 border-b">Course Code</th>
                  <th className="py-2.5 px-4 border-b">Department</th>
                  <th className="py-2.5 px-4 border-b">Instructor</th>
                </tr>
              </thead>
              <tbody>
                {displayedCourses.map((c) => (
                  <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-2.5 px-4 font-medium text-gray-800">{c.name}</td>
                    <td className="py-2.5 px-4 text-gray-600">{c.code}</td>
                    <td className="py-2.5 px-4 text-gray-600">{c.department}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          c.teacher?.trim().toLowerCase() === user?.name?.trim().toLowerCase()
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {c.teacher}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayedCourses.length === 0 && (
              <p className="text-gray-500 text-center py-8 italic">
                {activeTab === "my"
                  ? "You have not been assigned any courses yet."
                  : "No courses found."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
