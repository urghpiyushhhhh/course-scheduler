import express from "express";
import {
  registerUser,
  loginUser,
  verifyTokenHandler,
} from "../controllers/authController.js";

const router = express.Router();

// 📝 REGISTER USER
router.post("/register", registerUser);

// 🔐 LOGIN USER
router.post("/login", loginUser);

// ✅ VERIFY TOKEN
router.get("/verify", verifyTokenHandler);

export default router;
