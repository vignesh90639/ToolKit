import { useMemo, useReducer, useState } from "react";
import { registerUser } from "../api/api.js";
import { useNavigate } from "react-router-dom";

const initialForm = { name: "", email: "", password: "", confirm: "" };

function reducer(state, action) {
  if (action.type === "update") {
    return { ...state, [action.name]: action.value };
  }
  if (action.type === "reset") {
    return initialForm;
  }
  return state;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, dispatch] = useReducer(reducer, initialForm);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    const next = {};
    if (touched.name && form.name.trim().length < 2) {
      next.name = "Please add your full name";
    }
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (touched.password && form.password.length < 6) {
      next.password = "At least 6 characters";
    }
    if (touched.confirm && form.confirm !== form.password) {
      next.confirm = "Passwords need to match";
    }
    return next;
  }, [form, touched]);

  const passwordMeter = useMemo(() => {
    if (!form.password) return "";
    if (form.password.length > 10) return "Strong";
    if (form.password.length >= 6) return "Okay";
    return "Weak";
  }, [form.password]);

  const submitDisabled = submitting || Object.keys(errors).length > 0 || !form.name || !form.email || !form.password || !form.confirm;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (Object.keys(errors).length) {
      return;
    }

    setSubmitting(true);
    setServerError("");
    try {
      await registerUser({ name: form.name.trim(), email: form.email, password: form.password });
      dispatch({ type: "reset" });
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {serverError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium dark:text-gray-200">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(event) => dispatch({ type: "update", name: "name", value: event.target.value })}
              onBlur={() => handleBlur("name")}
              placeholder="Full name"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.name ? "border-red-400" : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={submitting}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => dispatch({ type: "update", name: "email", value: event.target.value })}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={submitting}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={(event) => dispatch({ type: "update", name: "password", value: event.target.value })}
              onBlur={() => handleBlur("password")}
              placeholder="Create a password"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.password ? "border-red-400" : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={submitting}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{passwordMeter && `Strength: ${passwordMeter}`}</div>
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="block mb-1 font-medium dark:text-gray-200">
              Confirm password
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={(event) => dispatch({ type: "update", name: "confirm", value: event.target.value })}
              onBlur={() => handleBlur("confirm")}
              placeholder="Re-enter password"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.confirm ? "border-red-400" : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={submitting}
            />
            {errors.confirm && <p className="text-sm text-red-500 mt-1">{errors.confirm}</p>}
          </div>
          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
