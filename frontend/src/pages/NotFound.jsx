import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-600 dark:text-blue-400 underline">Go to Login</Link>
    </div>
  );
}
