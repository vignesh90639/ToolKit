import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", enabled);
    setIsDark(enabled);
  }, []);

  useEffect(() => {
    const syncToken = (event) => {
      if (event.key === "token") {
        setToken(event.newValue);
      }
    };
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const nextValue = !prev;
      document.documentElement.classList.toggle("dark", nextValue);
      localStorage.setItem("theme", nextValue ? "dark" : "light");
      return nextValue;
    });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setToken(null);
    navigate("/login", { replace: true, state: { from: location.pathname } });
  }, [location.pathname, navigate]);

  const initials = useMemo(() => {
    const name = localStorage.getItem("userName") || "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((piece) => piece[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [token]);

  return (
    <nav className="bg-indigo-600 dark:bg-gray-900 dark:text-gray-100 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          TaskKit
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            onClick={toggleTheme}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {!token && (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
          {token && (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white text-xs uppercase">
                {initials || "U"}
              </span>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
