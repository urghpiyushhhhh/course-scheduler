import { useEffect, useState } from "react";
import api from "../api/axios";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="pt-20 p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Teacher Dashboard
      </h1>

      <div className="bg-white shadow-md p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>

        <table className="min-w-full border">
          <thead>
            <tr className="bg-indigo-50 text-left">
              <th className="py-2 px-4">Course</th>
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{c.name}</td>
                <td className="py-2 px-4">{c.code}</td>
                <td className="py-2 px-4">{c.department}</td>
                <td className="py-2 px-4">{c.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;
