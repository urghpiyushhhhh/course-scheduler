import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    teachers: 0,
    students: 0,
  });

  const [teachers, setTeachers] = useState([]); 
  const [courses, setCourses] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    department: "",
    teacher: "",
  });

  // 🔄 Fetch Stats (Courses, Teachers, Students)
  const refreshStats = async () => {
    try {
      const courseRes = await api.get("/courses/count");
      const teacherRes = await api.get("/users/teachers/count");
      const studentRes = await api.get("/users/students/count");

      setStats({
        courses: courseRes.data.count,
        teachers: teacherRes.data.count,
        students: studentRes.data.count,
      });
    } catch (err) {
      console.error("Stats refresh failed", err);
    }
  };

  // 🔁 Refresh stats if a new user was registered
  useEffect(() => {
    if (localStorage.getItem("refreshStats")) {
      refreshStats();
      localStorage.removeItem("refreshStats");
    }
  }, []);

  // 📘 Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // 👩‍🏫 Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await api.get("/users/teachers");
        setTeachers(data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  // Load stats initially
  useEffect(() => {
    refreshStats();
  }, []);

  // ➕ Add Course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/courses", newCourse);
      setCourses([...courses, data.course]);
      refreshStats();
      setNewCourse({ name: "", code: "", department: "", teacher: "" });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  // ✏️ Edit Course
  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/courses/${selectedCourse._id}`, selectedCourse);
      setCourses(
        courses.map((c) => (c._id === selectedCourse._id ? data.updated : c))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  // 🗑️ Delete Course
  const handleDeleteCourse = async () => {
    try {
      await api.delete(`/courses/${selectedCourse._id}`);
      setCourses(courses.filter((c) => c._id !== selectedCourse._id));
      refreshStats();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-red-700 mb-8">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-red-700 text-shadow-amber-500 text-sha">
            {stats.courses}
          </h2>
          <p className="text-slate-900">Total Courses</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-red-700 text-shadow-amber-500 text-sha">
            {stats.teachers}
          </h2>
          <p className="text-slate-900">Total Teachers</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-red-700 text-shadow-amber-500 text-sha">
            {stats.students}
          </h2>
          <p className="text-slate-900">Total Students</p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Courses</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
          >
            + Add Course
          </button>
        </div>

        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="">
            <tr className=" bg-indigo-50 text-left">
              <th className="py-2 px-4">Course Name</th>
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Teacher</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">{course.name}</td>
                <td className="py-2 px-4">{course.code}</td>
                <td className="py-2 px-4">{course.department}</td>
                <td className="py-2 px-4">{course.teacher}</td>

                <td className="py-2 px-4">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:underline mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODALS BELOW — (unchanged UI, fixed logic) */}
      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-red-900/30 backdrop-blur-md flex items-center justify-center z-50 transition-all">

          <div className="bg-white rounded-xl p-6 w-96 shadow-lg animate-modal">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Course
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <input
                type="text"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Course Code"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                placeholder="Department"
                value={newCourse.department}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, department: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              {/* Teacher Dropdown */}
              <select
                value={newCourse.teacher}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, teacher: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 cursor-pointer text-white rounded-lg"
                >
                  Add
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Edit & Delete Modals (unchanged structure) */}
      {/* ... (same as your previous UI code) ... */}
    </div>
  );
};

export default AdminDashboard;
