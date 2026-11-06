import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-red-800 text-white shadow-md px-6 py-3 flex justify-between items-center">

<div className="text-xl font-semibold tracking-wide">
        🎓 Course Scheduler
      </div>

      {user ? (
        <div className="flex items-center gap-6">
          {/* Role-based links */}
          {user.role === "Admin" && (
            <>
              <Link
                to="/admin"
                className="hover:text-gray-200 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/timetable"
                className="hover:text-gray-200 transition duration-200"
              >
                Timetable
              </Link>
            </>
          )}

          {user.role === "Teacher" && (
            <>
              <Link
                to="/teacher"
                className="hover:text-gray-200 transition duration-200"
              >
                My Courses
              </Link>
              <Link
                to="/timetable"
                className="hover:text-gray-200 transition duration-200"
              >
                Timetable
              </Link>
            </>
          )}

          {user.role === "Student" && (
            <>
              <Link
                to="/student"
                className="hover:text-gray-200 transition duration-200"
              >
                Courses
              </Link>
              <Link
                to="/timetable"
                className="hover:text-gray-200 transition duration-200"
              >
                Timetable
              </Link>
            </>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-white text-red-700 cursor-pointer px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="hover:text-gray-200 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-gray-200 transition duration-200"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
