import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="pt-20 p-8 min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Student Dashboard
      </h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Available Courses
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              {course.name}
            </h3>
            <p className="text-gray-600 mt-1">
              <span className="font-medium">Code:</span> {course.code}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Department:</span>{" "}
              {course.department}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Teacher:</span> {course.teacher}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
