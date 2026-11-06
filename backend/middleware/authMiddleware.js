// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ensure user still exists and attach fresh user (no password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // contains id, name, email, role, createdAt...
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// restrict route to admins
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "Admin") next();
  else res.status(403).json({ message: "Admin access only" });
};

// optionally allow admin or teacher
export const adminOrTeacher = (req, res, next) => {
  const r = req.user?.role;
  if (r === "Admin" || r === "Teacher") next();
  else res.status(403).json({ message: "Admins or Teachers only" });
};
