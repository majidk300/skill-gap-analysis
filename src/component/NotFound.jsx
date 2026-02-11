import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100 px-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md w-full transition-all">

        <h1 className="text-6xl font-bold text-emerald-700 mb-3">
          404
        </h1>

        <p className="text-lg font-semibold text-gray-800 mb-1">
          Page Not Found
        </p>

        <p className="text-sm text-gray-500 mb-5">
          Error Code: NOT_FOUND
        </p>

        <p className="text-gray-600 leading-relaxed mb-6">
          The page you’re trying to access isn’t available right now.
          It may have been moved, renamed, or no longer exists.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          You’ll be redirected to the home page shortly.
        </p>

        <button
          onClick={() => navigate("/")}
          className="
            mt-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-emerald-700 to-emerald-600
            text-white font-semibold
            transition-all duration-300 ease-out
            hover:from-emerald-600 hover:to-emerald-500
            hover:shadow-lg hover:scale-[1.03]
          "
        >
          Return to Home
        </button>

      </div>
    </div>
  );
};

export default NotFound;