import { useEffect, useMemo, useState } from "react";
import { getTasks, addTaskApi, deleteTaskApi, updateTaskApi } from "../api/api.js";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [userName, setUserName] = useState("User");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyTask, setBusyTask] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "User");
    fetchTasks();
  }, []);

  const fetchTasks = async (withSpinner = true) => {
    if (withSpinner) {
      setLoading(true);
    }
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || []);
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to fetch tasks";
      setError(message);
    } finally {
      setLoading(false);
      setBusyTask("");
      setEditingId("");
      setDraftTitle("");
    }
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayCount = tasks.filter((task) => new Date(task.created_at).toDateString() === today).length;
    return { total: tasks.length, today: todayCount };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const query = search.toLowerCase();
    return tasks.filter((task) => task.title.toLowerCase().includes(query));
  }, [tasks, search]);

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!newTask.trim()) return;
    setBusyTask("new");
    try {
      await addTaskApi(newTask.trim());
      setNewTask("");
      fetchTasks(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add task";
      setError(message);
    } finally {
      setBusyTask("");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setDraftTitle(task.title);
  };

  const saveEdit = async () => {
    if (!draftTitle.trim() || !editingId) return;
    setBusyTask(editingId);
    try {
      await updateTaskApi(editingId, draftTitle.trim());
      fetchTasks(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";
      setError(message);
      setBusyTask("");
    }
  };

  const removeTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    setBusyTask(taskId);
    try {
      await deleteTaskApi(taskId);
      fetchTasks(false);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete task";
      setError(message);
      setBusyTask("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Dashboard</p>
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Hi {userName}, welcome back.</h1>
          <p className="text-gray-600 dark:text-gray-400">Keep tabs on tasks, jot new ones, and tidy things up.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-blue-100 dark:border-blue-900">
            <p className="text-gray-500 text-sm">Total tasks</p>
            <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-green-100 dark:border-green-900">
            <p className="text-gray-500 text-sm">Added today</p>
            <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-white">{stats.today}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-purple-100 dark:border-purple-900">
            <p className="text-gray-500 text-sm">Focus</p>
            <p className="text-lg mt-2 text-gray-900 dark:text-white">Search, edit, or prune tasks below.</p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <form onSubmit={handleAddTask} className="flex-1 flex gap-2">
              <input
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="Add something you want to tackle"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={busyTask === "new" || !newTask.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {busyTask === "new" ? "Adding..." : "Add"}
              </button>
            </form>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => fetchTasks(false)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your tasks</h2>
            {loading && <span className="text-sm text-gray-500">Loading...</span>}
          </div>
          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Nothing here yet. Add your first task above.</div>
          )}
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="flex-1">
                  {editingId === task.id ? (
                    <input
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      className="w-full border border-blue-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added {new Date(task.created_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={busyTask === task.id || !draftTitle.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId("");
                          setDraftTitle("");
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(task)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeTask(task.id)}
                        disabled={busyTask === task.id}
                        className="px-3 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                      >
                        {busyTask === task.id ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
