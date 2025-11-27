import { useMemo, useReducer, useState } from "react";
import { loginUser } from "../api/api.js";
import { useLocation, useNavigate } from "react-router-dom";

const initialState = { email: "", password: "" };

function formReducer(state, action) {
  if (action.type === "field") {
    return { ...state, [action.name]: action.value };
  }
  if (action.type === "reset") {
    return initialState;
  }
  return state;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const clientErrors = useMemo(() => {
    const next = {};
    if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }
    if (touched.password && form.password.length < 6) {
      next.password = "At least 6 characters";
    }
    return next;
  }, [form, touched]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setTouched({ email: true, password: true });
    if (Object.keys(clientErrors).length) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
      if (res.data.user?.name) localStorage.setItem("userName", res.data.user.name);
      dispatch({ type: "reset" });
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {serverError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => dispatch({ type: "field", name: "email", value: event.target.value })}
              onBlur={() => onBlur("email")}
              placeholder="you@example.com"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                clientErrors.email ? "border-red-400" : "border-gray-300 dark:border-gray-600"
              }`}
              aria-invalid={Boolean(clientErrors.email)}
              disabled={submitting}
            />
            {clientErrors.email && <p className="text-sm text-red-500 mt-1">{clientErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => dispatch({ type: "field", name: "password", value: event.target.value })}
                onBlur={() => onBlur("password")}
                placeholder="Enter your password"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                  clientErrors.password ? "border-red-400" : "border-gray-300 dark:border-gray-600"
                }`}
                aria-invalid={Boolean(clientErrors.password)}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 text-sm text-blue-500"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {clientErrors.password && <p className="text-sm text-red-500 mt-1">{clientErrors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting || !form.email || !form.password}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Create one</a>
        </p>
      </div>
    </div>
  );
}
