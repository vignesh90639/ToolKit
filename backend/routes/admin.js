import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).lean();
    const normalized = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }));
    return res.json({ users: normalized });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
