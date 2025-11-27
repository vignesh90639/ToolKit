import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    }

    if (error.message === "Network Error" || error.code === "ECONNABORTED") {
      const err = new Error(
        "Network error: Cannot connect to server. Make sure the backend is running on http://localhost:5001"
      );
      err.response = error.response;
      return Promise.reject(err);
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (data) => {
  try {
    return await API.post("/auth/register", data);
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (data) => {
  try {
    return await API.post("/auth/login", data);
  } catch (err) {
    throw err;
  }
};

export const getTasks = async () => {
  try {
    return await API.get("/tasks");
  } catch (err) {
    throw err;
  }
};

export const addTaskApi = async (title) => {
  try {
    return await API.post("/tasks", { title });
  } catch (err) {
    throw err;
  }
};

export const updateTaskApi = async (id, title) => {
  try {
    return await API.put(`/tasks/${id}`, { title });
  } catch (err) {
    throw err;
  }
};

export const deleteTaskApi = async (id) => {
  try {
    return await API.delete(`/tasks/${id}`);
  } catch (err) {
    throw err;
  }
};
