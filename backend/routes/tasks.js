import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getTasks, addTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, addTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

export default router;
