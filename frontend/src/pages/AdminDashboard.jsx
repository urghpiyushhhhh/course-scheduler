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
      alert(err.response?.data?.message || "Failed to delete course");
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
          <h2 className="text-2xl font-semibold text-red-700">
            {stats.courses}
          </h2>
          <p className="text-slate-900">Total Courses</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-red-700">
            {stats.teachers}
          </h2>
          <p className="text-slate-900">Total Teachers</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl text-center">
          <h2 className="text-2xl font-semibold text-red-700">
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

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-indigo-50 text-left">
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
                        setSelectedCourse({ ...course });
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:underline mr-4 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <p className="text-gray-500 text-center py-6">No courses created yet.</p>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-red-900/30 backdrop-blur-md flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg animate-modal">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Course
            </h3>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS101"
                  value={newCourse.code}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={newCourse.department}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Teacher Dropdown */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Teacher</label>
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
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 cursor-pointer text-white rounded-lg hover:bg-red-800 transition"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && selectedCourse && (
        <div className="fixed inset-0 bg-red-900/30 backdrop-blur-md flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg animate-modal">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Course
            </h3>

            <form onSubmit={handleEditCourse} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={selectedCourse.name}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="Course Code"
                  value={selectedCourse.code}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Department</label>
                <input
                  type="text"
                  placeholder="Department"
                  value={selectedCourse.department}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Teacher</label>
                <select
                  value={selectedCourse.teacher}
                  onChange={(e) =>
                    setSelectedCourse({ ...selectedCourse, teacher: e.target.value })
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
                  {selectedCourse.teacher && !teachers.some((t) => t.name === selectedCourse.teacher) && (
                    <option value={selectedCourse.teacher}>{selectedCourse.teacher}</option>
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 cursor-pointer text-white rounded-lg hover:bg-red-800 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-red-900/30 backdrop-blur-md flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg animate-modal">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete <span className="font-semibold text-gray-800">{selectedCourse.name}</span> ({selectedCourse.code})? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCourse}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
