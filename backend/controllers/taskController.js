import Task from "../models/taskModel.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ created_at: -1 }).lean();
    const normalized = tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      user_id: task.user.toString(),
      created_at: task.created_at,
    }));
    return res.json({ tasks: normalized });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({ user: req.user.id, title });
    return res.json({ message: "Task added", taskId: task.id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedTask = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, { title }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
